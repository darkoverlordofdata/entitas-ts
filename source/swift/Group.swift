//
//  Group.swift
//  Entitas
//
//  Created by Maxim Zaks on 21.12.14.
//  Copyright (c) 2014 Maxim Zaks. All rights reserved.
//


/// A protocol which lets you monitor a group for changes
public protocol GroupObserver : class {
    func entityAdded(entity : Entity)
    func entityRemoved(entity : Entity, withRemovedComponent removedComponent : Component)
}

/// A group contains all entities which apply to a certain matcher.
/// Groups are created through Context.entityGroup method.
/// Groups are always up to date.
/// Groups are internally cached in Context class, so you don't have to be concerned about caching them your self, just call Context.entityGroup method when you need it.
public class Group {
    
    /// The matcher witch decides if entity belongs to the group.
    public let matcher : Matcher
    private var entities : [Int:Entity] = [:]
    private var observers : [GroupObserver] = []
    private var _sortedEntities : [Entity]?
    
    init(matcher : Matcher){
        self.matcher = matcher
    }
    
    func addEntity(e : Entity) {
        if let entity = entities[e.creationIndex] {
            return;
        }
        entities[e.creationIndex] = e
        _sortedEntities = nil
        for listener in observers {
            listener.entityAdded(e)
        }
    }
    
    func removeEntity(e : Entity, withRemovedComponent removedComponent : Component) {
        let prevValue = entities.removeValueForKey(e.creationIndex)
        if prevValue == nil {
            return
        }
        
        _sortedEntities = nil
        for listener in observers {
            listener.entityRemoved(e, withRemovedComponent: removedComponent)
        }
    }

    /// Returns how many entities are in the group
    public var count : Int{
        get {
            return entities.count
        }
    }
    
    /// Returns an array of entities sorted by entity creation index
    public var sortedEntities: [Entity] {
        get {
            if let sortedEntities = _sortedEntities {
                return sortedEntities
            }
            
            let sortedKeys = entities.keys.array.sorted(<)
            var sortedEntities : [Entity] = []
            for key in sortedKeys {
                sortedEntities.append(entities[key]!)
            }
            _sortedEntities = sortedEntities
            return _sortedEntities!
        }
    }
    
    /// Add observer to the group so that you get notified when entity is added or removed from the group.
    /// This happens when relevant components are set or removed from the entity.
    public func addObserver(observer : GroupObserver) {
        // TODO: better implemented with Set, however think about Hashable
        for _observer in observers {
            if _observer === observer {
                return
            }
        }
        observers.append(observer)
    }
    
    /// Remove observer from the group. Call it when you don't want to be notified any more. Specially if you want to destroy observer object.
    public func removeObserver(observer : GroupObserver) {
        // TODO: better implemented with Set (iOS 8.3)
        observers = observers.filter({$0 !== observer})
    }
}

/// Makes a group compatible with 'for in' statement and other iteration functions
extension Group : SequenceType {
    public func generate() -> GeneratorOf<Entity> {
        return SequenceOf(entities.values).generate()
    }
    
    /// Convenience method for filtering entities from the group during iteration
    public func without(matcher : Matcher) -> SequenceOf<Entity> {
        return SequenceOf(entities.values.filter{
            matcher.isMatching($0)
        })
    }
}

//
//  Collector.swift
//  Entitas
//
//  Created by Maxim Zaks on 20.01.15.
//  Copyright (c) 2015 Maxim Zaks. All rights reserved.
//


/// Collector is a group observer which gathers all entities which were added or removed (according to GroupChangeType you provide) to the observed group.
/// It helps you to collect changes over time and react on all changes at your convenience.
public class Collector: GroupObserver {
    
    /// Defines on which change an entity should be collected.
    /// 'Added' means that we collect an entity if it was added to the group. Even if it was removed from the group later, the entity stays inside of collector.
    /// 'Removed' means that we collect an entity if it was removed from the group. Even if it was added to the group later on the entity stays inside of collector.
    /// 'AddedAndRemoved' means that we collect an entity if it was added or removed from the group.
    /// 'AddedOnly' means that we collect an entity if it was added to the group. If we remove it again we remove it from collector.
    /// 'RemovedOnly' means that we collect an entity if it was removed from the group. If we add it again we remove it from collector.
    public enum GroupChangeType {
        case Added
        case Removed
        case AddedAndRemoved
        case AddedOnly
        case RemovedOnly
    }
    
    let changeType : GroupChangeType
    var collectedEntities : [Entity] = []
    var entityIdToPosition : [Int:Int] = [:]
    
    /// Init method where you have to provide the group that should be observed and the change type you are interested in.
    public init(group : Group, changeType : GroupChangeType) {
        self.changeType = changeType
        group.addObserver(self)
    }
    
    /// Implementation of GroupObserver protocol.
    public func entityAdded(entity : Entity) {
        if(entityIdToPosition[entity.creationIndex] != nil && changeType != .RemovedOnly){
            return
        }
        switch changeType {
        case .Removed : return
        case .RemovedOnly :
            collectedEntities.removeAtIndex(entityIdToPosition[entity.creationIndex]!)
            entityIdToPosition.removeValueForKey(entity.creationIndex)
        default :
            collectedEntities.append(entity)
            entityIdToPosition[entity.creationIndex] = collectedEntities.count - 1
        }
    }
    
    /// Implementation of GroupObserver protocol.
    public func entityRemoved(entity : Entity, withRemovedComponent removedComponent : Component) {
        if(entityIdToPosition[entity.creationIndex] != nil && changeType != .AddedOnly){
            return
        }
        switch changeType {
        case .Added : return
        case .AddedOnly :
            collectedEntities.removeAtIndex(entityIdToPosition[entity.creationIndex]!)
            entityIdToPosition.removeValueForKey(entity.creationIndex)
        default :
            collectedEntities.append(entity)
            entityIdToPosition[entity.creationIndex] = collectedEntities.count - 1
        }
    }
    
    /// Pull lets you get the collected entities in the order how they where collected.
    /// By providing an amount you can define how many changed entities you would like to get. Think about it as of a queue of changes.
    /// The amount parameter is introduced in case there are to many changes to process in one go, so you can process those changes sequentially.
    /// By setting amount to '-1' you will get all collected entities.
    public func pull(amount : Int = -1) -> ArraySlice<Entity> {
        if(amount == 0){
            return []
        }
        
        if(amount < 0){
            let result = collectedEntities[0..<collectedEntities.count]
            collectedEntities.removeAll(keepCapacity: false)
            entityIdToPosition.removeAll(keepCapacity: false)
            return result
        }
        
        let bound = amount > collectedEntities.count ? collectedEntities.count : amount
        
        let result = collectedEntities[0..<bound]
        
        for entity in result {
            entityIdToPosition.removeValueForKey(entity.creationIndex)
        }
        
        collectedEntities[0..<bound] = []
        
        return result
    }
}

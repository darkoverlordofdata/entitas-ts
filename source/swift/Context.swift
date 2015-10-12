//
//  Context.swift
//  Entitas
//
//  Created by Maxim Zaks on 21.12.14.
//  Copyright (c) 2014 Maxim Zaks. All rights reserved.
//

/// Context is the central piece of Entitas framework.
/// It manages the entities and groups of entities, keeping every thing up to date.
public class Context : _EntityChangedListener {
    
    private var entities : Set<Entity> = []
    private var entityCreationIndex = 0
    private var groupLookupByMatcher : [Matcher:Group] = [:]
    private var groupsLookupByAnyId : [ComponentId:[Group]] = [:]
    private var groupsLookupByAllId : [ComponentId:[Group]] = [:]
    
    /// Simple and empty init method.
    public init(){}
    
        /// Hard resets of context.
        /// Deletes all references to entities and groups.
        /// Sets entity creation index back to 0.
        /// Currently no observer will be notified about the reset.
    public func reset(){
        entities.removeAll(keepCapacity: false)
        entityCreationIndex = 0
        groupLookupByMatcher.removeAll(keepCapacity: false)
        groupsLookupByAnyId.removeAll(keepCapacity: false)
        groupsLookupByAllId.removeAll(keepCapacity: false)
    }
    
        /// The only way for creation of an entity.
        /// This way the entity is managed by the context and gets it creation index.
        /// The entity will communicate every change to the managing context.
    public func createEntity() -> Entity {
        let e = Entity(listener: self, creationIndex: entityCreationIndex++)
        entities.insert(e)
        return e
    }
    
    /// The only way to get a group. The groups are cached so if you will call this method with the same matcher multiple times you will get the same instance of the group.
    public func entityGroup(matcher : Matcher) -> Group {
        if let group = groupLookupByMatcher[matcher] {
            return group
        }
        
        let group = Group(matcher: matcher)
        groupLookupByMatcher[matcher] = group;
        fillGroupWithEntities(group)
        
        switch group.matcher.type{
        case .Any : addGroupToLoockupByAnyId(group)
        case .All : addGroupToLoockupByAllId(group)
        }
        
        return group
    }
    
    /// When you destroy an entity, the entity will remove all its components and by that it will also leave all the groups accordingly.
    /// It will inform observers that it was destroyed.
    /// Be caution about destroying entities. Most of the time flagging an entity with a component can do the job and is more appropriate according to data consistency.
    public func destroyEntity(entity : Entity) {
        entity.destroy()
        entities.remove(entity)
    }
    
    /// Destroy all entities for example if you want to have a soft reload.
    /// Groups are not destroyed, therefor all observers will be notified.
    public func destroyAllEntities() {
        for e in entities {
            destroyEntity(e)
        }
    }
    
    func fillGroupWithEntities(group : Group){
        for e in entities {
            if group.matcher.isMatching(e){
                group.addEntity(e)
            }
        }
    }
    
    func addGroupToLoockupByAnyId(group : Group) {
        for cid in group.matcher.componentIds {
            var groups : [Group] = []
            if let _groups = groupsLookupByAnyId[cid]{
                groups = _groups
            }
            
            groups.append(group)
            groupsLookupByAnyId[cid] = groups
        }
    }
    
    func addGroupToLoockupByAllId(group : Group) {
        for cid in group.matcher.componentIds {
            var groups : [Group] = []
            if let _groups = groupsLookupByAllId[cid]{
                groups = _groups
            }
            
            groups.append(group)
            groupsLookupByAllId[cid] = groups
        }
    }
        
    func componentAdded(entity: Entity, component: Component) {
        
        let componentId = cId(component)
        
        if let groups = groupsLookupByAnyId[componentId]{
            for group in groups{
                group.addEntity(entity)
            }
        }
        if let groups = groupsLookupByAllId[componentId]{
            for group in groups{
                if group.matcher.isMatching(entity){
                    group.addEntity(entity)
                }
            }
        }
    }
    
    func componentRemoved(entity: Entity, component: Component) {
        
        let componentId = cId(component)
        
        if let groups = groupsLookupByAllId[componentId]{
            for group in groups{
//                if group.matcher.isMatching(entity){
                    group.removeEntity(entity, withRemovedComponent: component)
//                }
            }
        }
        if let groups = groupsLookupByAnyId[componentId]{
            for group in groups{
                if !group.matcher.isMatching(entity){
                    group.removeEntity(entity, withRemovedComponent: component)
                }
            }
        }
    }
    
    var numberOfGroups:Int{
        return groupLookupByMatcher.count
    }
}

//
//  Entity.swift
//  Entitas
//
//  Created by Maxim Zaks on 08.12.14.
//  Copyright (c) 2014 Maxim Zaks. All rights reserved.
//

import Foundation

/// ComponentId identifies the type of a component.
public typealias ComponentId = String

/// Returns component id for component instance.
public func cId(c : Component) -> ComponentId {
    return reflect(c.dynamicType).summary
}

/// Returns component id for component type.
public func cId<C:Component>(ct:C.Type) -> ComponentId {
    return reflect(ct).summary
}

/// A ghost protocol which identifies a struct as a component.
/// We suggest to use structs for component representation as component should be immutable value objects.
public protocol Component {
}

/// A protocol which should be implemented by a class monitoring entity changes.
public protocol EntityChangedListener : class {
    func componentAdded(entity: Entity, component: Component)
    func componentRemoved(entity: Entity, component: Component)
    func entityDestroyed()
}


// _EntityChangedListener is introduced to be an internal access protocol which Context implements.
// We avoid EntityChangedListener as it is public and therefore would pollute Context API.
protocol _EntityChangedListener : class {
    func componentAdded(entity: Entity, component: Component)
    func componentRemoved(entity: Entity, component: Component)

}

/// Entity can be seen as a bag of components. 
/// It is managed by a context and also created by a context instance.
/// For querying a group of entities please have a look at Group class.
/// You can observe entity changes by implementing EntityChangedListener protocol.
public final class Entity {
    private var _components : [ComponentId:Component]
    private var observers : [EntityChangedListener]
    unowned let mainListener : _EntityChangedListener
    /// Constant value which is set when an entity is created by a context.
    public let creationIndex : Int
    
    init(listener : _EntityChangedListener, creationIndex : Int) {
        _components = [:]
        mainListener = listener
        observers = []
        self.creationIndex = creationIndex
    }
    
    /// This method adds a component to the entity.
    /// When the entity already has component of the given type and overwrite parameter was not set to true, "Illegal overwrite error" will be raised.
    /// This precaution is defined, because it proved to help find bugs during development.
    /// When you overwrite a component, the old component will be first removed from the entity and than the new component will be added. This mechanism ensures that observers get full picture. This is also why component should be immutable.
    public func set(c:Component, overwrite:Bool = false) {
        let componentId = cId(c)
        
        if _components[componentId] != nil && !overwrite {
            assertionFailure("Illegal overwrite error")
        }
        
        if overwrite {
            self.removeComponent(componentId)
        }
        
        _components[componentId] = c;
        mainListener.componentAdded(self, component:c)
        for observer in observers {
            observer.componentAdded(self, component: c)
        }
    }
    
    /// Returns an option value for component type.
    public func get<C:Component>(ct:C.Type) -> C? {
        let componentName = cId(ct)
        if let c = _components[componentName] {
            return c as? C
        }
        return nil
    }

    /// Checks if entity already has a component of following component type.
    public func has<C:Component>(ct:C.Type) -> Bool {
        return hasComponent(cId(ct))
    }
    
    func hasComponent(cId:ComponentId) -> Bool {
        return _components[cId] != nil
    }
    
    /// Removes a component from the entity. If the entity doesn't have a component of this type, nothing happens.
    public func remove<C:Component>(ct:C.Type) {
        removeComponent(cId(ct))
    }
    
    func removeComponent(componentId:ComponentId) {
        if _components.indexForKey(componentId) == nil {
            return
        }
        
        if let component = _components.removeValueForKey(componentId) {
            mainListener.componentRemoved(self, component: component)
            for observer in observers {
                observer.componentRemoved(self, component: component)
            }
        }
    }
    
    /// Lets you iterate through all components in the entity.
    public var components : SequenceOf<Component> {
        get {
            return SequenceOf(_components.values)
        }
    }

    /// Detach creates a DetachedEntity struct which can be changed without informing the managing context about the changes.
    /// This is meant for multithreading, when you need to make heavy computations on a secondary thread and than sync back the changes to the entity on the main thread.
    /// Important to note that detached entity is not aware of changes that might happen to the entity after it was created. Therefore on sync, detached entity might overwrite the changes which happened to the entity between 'detach' and 'sync' calls.
    /// As DetachEntity is a struct, every call of this getter will create a new instance. It is up to you to make sure that you don't have concurrent detached entities.
    public var detach : DetachedEntity {
        get {
            return DetachedEntity(entity: self, components: _components, changedComponents: [:])
        }
    }
    
    func destroy() {
        for component in components {
            _components.removeValueForKey(cId(component))
            mainListener.componentRemoved(self, component: component)
        }
        for observer in observers {
            observer.entityDestroyed()
        }
        observers.removeAll(keepCapacity: false)
    }
    
    /// Adding observer to entity. Observer will get notified when a component is added or removed. On overwrite observer will get removed and than directly added notification. Observer is also notified when an entity is destroyed.
    public func addObserver(observer : EntityChangedListener) {
        // TODO: better implemented with Set, however think about Hashable
        for _observer in observers {
            if _observer === observer {
                return
            }
        }
        observers.append(observer)
    }
    
    /// Removing observer. Call it when you don't want to be notified any more. Specially if you want to destroy observer object.
    public func removeObserver(observer : EntityChangedListener) {
        // TODO: better implemented with Set, however think about Hashable
        observers = observers.filter({$0 !== observer})
    }
    
}

/// The hash of the entity has to be combined by the main listener(managing context) and the creation index.
extension Entity : Hashable {
    public var hashValue: Int {
        let ptr: COpaquePointer = Unmanaged<AnyObject>.passUnretained(mainListener).toOpaque()
        return ptr.hashValue + creationIndex
    }
}

/// Equality function for entity class. An entity is equal if it is managed by the same context and has equal creation index.
public func == (lhs: Entity, rhs: Entity) -> Bool {
    return lhs.creationIndex == rhs.creationIndex && lhs.mainListener === rhs.mainListener
}


/// Detached entity is meant to be used in multithreading scenario. Please have a look at detach method on Enitty class.
public struct DetachedEntity {
    weak private var entity : Entity?
    private var components : [ComponentId:Component]
    private var changedComponents : [ComponentId:Bool] = [:]
    
    /// Works as Entity.set method, without notifying any observer (context included).
    public mutating func set(c:Component, overwrite:Bool = false) {
        let componentId = cId(c)
        
        if components[componentId] != nil && !overwrite {
            assertionFailure("Illegal overwrite error")
        }
        
        components[componentId] = c;
        changedComponents[componentId] = true
    }
    
    /// Works as Entity.get method.
    public func get<C:Component>(ct:C.Type) -> C? {
        if let c = components[cId(ct)] {
            return c as? C
        }
        return nil
    }
    
    /// Works as Entity.get method.
    public func has<C:Component>(ct:C.Type) -> Bool {
        return components[cId(ct)] != nil
    }
    
    /// Works as Entity.remove method.
    public mutating func remove<C:Component>(ct:C.Type) {
        let componentId : ComponentId = cId(ct)
        if components.indexForKey(componentId) == nil {
            return
        }
        
        components.removeValueForKey(componentId)
        changedComponents[componentId] = true
    }
    
    /// Sync will go through all changed components and set or remove components from the managed entity instance accordingly to the changes.
    /// As detached entity was meant to be used in multithreading scenario, the syncing is done asynchronously on a special queue. You can specify the queue and dispatch a function as you wish. Defaults are main queue and 'dispatch_async' function.
    public mutating func sync(
                    onQueue queue : dispatch_queue_t = dispatch_get_main_queue(),
                    dispatchFunction : (dispatch_queue_t, dispatch_block_t) -> () = dispatch_async) {
        let localComponets = components
        let keys = changedComponents.keys
        let localEntity = entity
        dispatchFunction(queue) {
            for key in keys {
                if let component = localComponets[key] {
                    localEntity?.set(component, overwrite:true)
                } else {
                    localEntity?.removeComponent(key)
                }
            }
        }
        changedComponents.removeAll(keepCapacity: false)
    }
}

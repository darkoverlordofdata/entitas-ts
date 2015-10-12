//
//  DebugContext.swift
//  Entitas
//
//  Created by Maxim Zaks on 30.01.15.
//  Copyright (c) 2015 Maxim Zaks. All rights reserved.
//

import Foundation

/// Debug context is a subclass of context which will protocol every change happening to entities or groups.
public class DebugContext : Context {
    
    let creationTime : CFAbsoluteTime
    var entityCreationTimeDeltas : [Int:CFAbsoluteTime] = [:]
    /// Function used to protocol entity and group changes.
    public var printFunction : (String) -> ()
    
    /// Init method with default value for print function.
    /// It also saves the creation time for delta time calculations.
    public init(printFunction : (String) -> () = println){
        creationTime = CFAbsoluteTimeGetCurrent()
        self.printFunction = printFunction
        super.init()
    }
    
    public override func createEntity() -> Entity {
        let e = super.createEntity()
        entityCreationTimeDeltas[e.creationIndex] = deltaTime
        printFunction("Entity: \(e.creationIndex) created. (\(entityCreationTimeDeltas[e.creationIndex]!))")
        return e
    }
    
    public override func destroyEntity(entity : Entity) {
        super.destroyEntity(entity)
        let currentTime = CFAbsoluteTimeGetCurrent()
        printFunction("Entity: \(entity.creationIndex) destroyed. Age: (\(entityAge(entity)) (\(deltaTime))")
    }
    
    public override func entityGroup(matcher : Matcher) -> Group {
        let group = super.entityGroup(matcher)
        printFunction("Group: \(matcher.matcherKey) requested. (\(numberOfGroups)) (\(deltaTime))")
        return group
    }
    
    override func componentAdded(entity: Entity, component: Component) {
        super.componentAdded(entity, component: component)
        
        let componentId = cId(component)
        
        if let _component : DebugPrintable = component as? DebugPrintable {
            printFunction("Entity: \(entity.creationIndex) added Component: \(componentId) \(_component.debugDescription). (\(deltaTime))")
        } else {
            printFunction("Entity: \(entity.creationIndex) added Component: \(componentId). (\(component)) (\(deltaTime))")
        }
        
    }
    
    override func componentRemoved(entity: Entity, component: Component) {
        super.componentRemoved(entity, component: component)
        
        let componentId = cId(component)
        
        if let _component : DebugPrintable = component as? DebugPrintable {
            printFunction("Entity: \(entity.creationIndex) removed Component: \(componentId) \(_component.debugDescription). (\(deltaTime))")
        } else {
            printFunction("Entity: \(entity.creationIndex) removed Component: \(componentId). (\(component)) (\(deltaTime))")
        }
        
    }
    
    var deltaTime : CFAbsoluteTime
    {
        return CFAbsoluteTimeGetCurrent() - creationTime
    }
    
    func entityAge(e: Entity )->CFAbsoluteTime{
        return CFAbsoluteTimeGetCurrent() - entityCreationTimeDeltas[e.creationIndex]!
    }
    
}
//
//  Matcher.swift
//  Entitas
//
//  Created by Maxim Zaks on 21.12.14.
//  Copyright (c) 2014 Maxim Zaks. All rights reserved.
//

/// Function for comparing two matchers
public func == (lhs: Matcher, rhs: Matcher) -> Bool {
    return lhs.matcherKey == rhs.matcherKey
}

var matchers : [String : Matcher] = [:]

/// Matcher is used to identify if an entity has the desired components.
public struct Matcher : Hashable {
    
    /// List of components to check in the entity.
    public let componentIds : [ComponentId]
    enum MatcherType{
        case All, Any
        func matcherKey(componentIds: [ComponentId])->String{
            switch self{
            case .All : return "&".join(componentIds)
            case .Any : return "|".join(componentIds)
            }
        }
    }
    
    let matcherKey : String
    
    let type : MatcherType
    
    /// Returns a matcher which will check that an entity has all of the listed components.
    /// The matchers are cached for performance reasons. Also the order of component types is not important. (A, B, C) and (B, C, A) will result as the same matcher.
    public static func All<C>(componentTypes : C.Type...) -> Matcher {
        var componentIds = componentTypes.map({reflect($0).summary})
        
        componentIds = fixComponentIds(componentIds)
        
        return GetMatcher(componentIds, type: MatcherType.All)
    }
    
    /// Returns a matcher which will check that an entity has at least one of the listed components.
    /// The matchers are cached for performance reasons. Also the order of component types is not important. (A, B, C) and (B, C, A) will result as the same matcher.
    public static func Any<C>(componentTypes : C.Type...) -> Matcher {
        
        var componentIds = componentTypes.map({reflect($0).summary})
        
        componentIds = fixComponentIds(componentIds)
        
        return GetMatcher(componentIds, type: .Any)
    }
    
    private static func GetMatcher(componentIds:[ComponentId], type : MatcherType) -> Matcher {
        let sortedComponentIds = componentIds.sorted(<)
        let matcherKey = type.matcherKey(sortedComponentIds)
        
        if let matcher = matchers[matcherKey] {
            return matcher
        } else {
            let matcher = Matcher(componentIds: sortedComponentIds, type: type, matcherKey: matcherKey)
            matchers[matcherKey] = matcher
            return matcher
        }
    }
        
    init(componentIds : [ComponentId], type : MatcherType, matcherKey : String) {
        self.componentIds = componentIds
        self.type = type
        self.matcherKey = matcherKey
    }
    
    /// This method performs the check.
    public func isMatching(entity : Entity) -> Bool {
        switch type {
        case .All : return isAllMatching(entity)
        case .Any : return isAnyMatching(entity)
        }
    }
    
    func isAllMatching(entity : Entity) -> Bool {
        for cid in componentIds {
            if(!entity.hasComponent(cid)){
                return false
            }
        }
        return true
    }
    
    func isAnyMatching(entity : Entity) -> Bool {
        for cid in componentIds {
            if(entity.hasComponent(cid)){
                return true
            }
        }
        return false
    }
    
    ///
    public var hashValue: Int {
        get {
            return matcherKey.hashValue
        }
    }
    
}



// This is very dirty! seems like a bug in Swift
func fixComponentIds(types : [String]) -> [String] {

    if types.count > 1 {
        return types
    }
    
    var value = types.first!
    
    if startsWith(value, "(") {
        let removedParethesis = value[1..<count(value)-1]
        return removedParethesis.componentsSeparatedByString(", ")
    }
    
    return types
}

// TODO: remove when fixComponentIds not needed any more
extension String {
    
    subscript (i: Int) -> Character {
        return self[advance(self.startIndex, i)]
    }
    
    subscript (i: Int) -> String {
        return String(self[i] as Character)
    }
    
    subscript (r: Range<Int>) -> String {
        return substringWithRange(Range(start: advance(startIndex, r.startIndex), end: advance(startIndex, r.endIndex)))
    }
}

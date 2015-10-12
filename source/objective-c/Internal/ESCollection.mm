#import "ESCollection+Internal.h"
#import "ESEntity+Internal.h"
#import "ESMatcher.h"
#import <map>

@implementation ESCollection
{
    ESMatcher *_typeMatcher;
    std::map<u_long, id> _entities;
    NSMutableArray *_addObservers;
    NSMutableArray *_removeObservers;
    NSMutableArray *_cachedEntities;
}


- (id)initWithTypes:(NSSet *)types
{
    return [self initWithMatcher:[ESMatcher allOfSet:types] ];
}

- (id)initWithMatcher:(ESMatcher *)types
{
    self = [super init];
    if (self)
    {
        _typeMatcher = types;

        _addObservers = [NSMutableArray array];
        _removeObservers = [NSMutableArray array];
    }

    return self;
}

- (ESMatcher *)typeMatcher
{
    return _typeMatcher;
}

- (void)addEntity:(ESEntity *)changedEntity {

    _cachedEntities = nil;
    std::map<u_long, id>::iterator it= _entities.find(changedEntity.creationIndex);

    if(it == _entities.end()){
        _entities.insert(std::pair<u_long, id>(changedEntity.creationIndex, changedEntity));
    }

    for (id<ESCollectionObserver> observer in _addObservers){
        [observer entity:changedEntity changedInCollection:self withChangeType:(ESEntityAdded)];
    }
}

- (void)exchangeEntity:(ESEntity *)entity {

    std::map<u_long, id>::iterator it= _entities.find(entity.creationIndex);
    if(it != _entities.end()){
        for (id<ESCollectionObserver> observer in _removeObservers){
            [observer entity:entity changedInCollection:self withChangeType:(ESEntityRemoved)];
        }
        for (id<ESCollectionObserver> observer in _addObservers){
            [observer entity:entity changedInCollection:self withChangeType:(ESEntityAdded)];
        }
    } else {
        [self addEntity:entity];
    }

}

- (NSArray *)entities
{
    if(_cachedEntities){
        return _cachedEntities;
    }
    _cachedEntities = [NSMutableArray new];
    for (std::map<u_long, id>::iterator it= _entities.begin(); it!= _entities.end(); ++it){
        [_cachedEntities addObject:it->second];
    }

    return _cachedEntities;
}

- (void)removeEntity:(ESEntity *)entity {

    std::map<u_long, id>::iterator it= _entities.find(entity.creationIndex);
    if(it == _entities.end()){
        return;
    }

    _cachedEntities = nil;

    _entities.erase(it);
    for (id<ESCollectionObserver> observer in _removeObservers){
        [observer entity:entity changedInCollection:self withChangeType:(ESEntityRemoved)];
    }

}

- (void)addObserver:(id <ESCollectionObserver>)observer forEvent:(ESEntityChange)event {
    if(event == ESEntityAdded){
        if(![_addObservers containsObject:observer]) {
            [_addObservers addObject:observer];
        }
    } else if (event == ESEntityRemoved) {
        if(![_removeObservers containsObject:observer]) {
            [_removeObservers addObject:observer];
        }
    }
}

- (void)removeObserver:(id <ESCollectionObserver>)observer forEvent:(ESEntityChange)event {
    if(event == ESEntityAdded){
        [_addObservers removeObject:observer];
    } else if (event == ESEntityRemoved) {
        [_removeObservers removeObject:observer];
    }
}


@end
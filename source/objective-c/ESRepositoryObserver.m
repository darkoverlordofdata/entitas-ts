#import "ESRepositoryObserver.h"
#import "ESEntityRepository+Internal.h"


@interface ESRepositoryObserver (CollectionObserver) <ESCollectionObserver>

@end


@implementation ESRepositoryObserver {
    ESCollection *_watcherCollection;
    NSMutableArray *_collectedEntities;
    ESEntityChange _changeTrigger;
}


- (id)initWithRepository:(ESEntityRepository *)repository matcher:(ESMatcher *)matcher {
    return [self initWithRepository:repository matcher:matcher trigger:ESEntityAdded];
}


- (id)initWithRepository:(ESEntityRepository *)repository matcher:(ESMatcher *)matcher trigger:(ESEntityChange)changeTrigger {
    self = [super init];
    if (self) {
        NSAssert(repository != nil, @"Repository cannot be nil");
        NSAssert(matcher != nil, @"Matcher cannot be nil");

        _changeTrigger = changeTrigger;
        _collectedEntities = [[NSMutableArray alloc] init];
        _watcherCollection = [repository collectionForMatcher:matcher];
        [self startListening];
    }

    return self;
}


- (NSArray *)drain {
    if( _collectedEntities.count == 0) {
        return @[];
    }

    //If creating new NSMutableArrays is too expensive, we could instead just create two of them, use removeAllObjects and switch between them
    NSArray *returnedEntities = _collectedEntities;
    _collectedEntities = [[NSMutableArray alloc] init];
	return returnedEntities;
}


- (void)deactivate {
    _collectedEntities = [[NSMutableArray alloc] init];
    [self stopListening];
}


- (void)activate {
    [self startListening];
}


- (void)startListening {
    [_watcherCollection addObserver:self forEvent:_changeTrigger];
}


- (void)stopListening {
    [_watcherCollection removeObserver:self forEvent:_changeTrigger];
}


@end


@implementation ESRepositoryObserver (CollectionObserver)

- (void)entity:(ESEntity *)changedEntity changedInCollection:(ESCollection *)collection withChangeType:(ESEntityChange)changeType {
    ESEntity *originalEntity = changedEntity;
    if (![_collectedEntities containsObject:originalEntity]) {
        [_collectedEntities addObject:originalEntity];
    }
}

@end

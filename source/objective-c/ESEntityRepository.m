#import "ESEntityRepository+Internal.h"
#import "ESMatcher.h"
#import "ESEntity+Internal.h"
#import "ESCollection+Internal.h"


@implementation ESEntityRepository
{
    NSMutableSet *_entities;
    NSMutableDictionary *_collections; // matcher -> collection
    NSMutableDictionary *_collectionsForType; // componentType -> Set[collection]
    u_long _entityIndex;
}

- (id)init
{
    self = [super init];
    if (self)
    {
        _entities = [NSMutableSet new];
        _collections = [NSMutableDictionary dictionary];
        _collectionsForType = [NSMutableDictionary dictionary];
    }

    return self;
}

- (ESEntity *)createEntity
{
    ESEntity *entity = [[ESEntity alloc] initWithIndex:_entityIndex inRepository:self];
    [_entities addObject:entity];
    _entityIndex++;
    return entity;
}

- (void)destroyEntity:(ESEntity *)entity
{
    for (Class componentType in [[entity componentTypes] copy])
        [entity removeComponentOfType:componentType];

    [_entities removeObject:entity];
}

- (BOOL)containsEntity:(ESEntity *)entity
{
    return [_entities containsObject:entity];
}

- (void)componentOfType:(Class)type hasBeenAddedToEntity:(ESEntity *)entity {
    for(ESCollection *collection in [self internalCollectionsForType:type])
    {
        if ([[collection typeMatcher] areComponentsMatching:[entity componentTypes]])
            [collection addEntity:entity];
    };
}

- (void)componentOfType:(Class)type hasBeenExchangedInEntity:(ESEntity *)entity {
    for(ESCollection *collection in [self internalCollectionsForType:type])
    {
        if ([[collection typeMatcher] areComponentsMatching:[entity componentTypes]])
            [collection exchangeEntity:entity];
    };
}


- (void)componentOfType:(Class)type hasBeenRemovedFromEntity:(ESEntity *)entity {

    NSMutableSet *originalComponentTypes = [[entity componentTypes] mutableCopy];
    [originalComponentTypes addObject:type];

    for(ESCollection *collection in [self internalCollectionsForType:type])
    {
        if ([[collection typeMatcher] areComponentsMatching:originalComponentTypes] && ![[collection typeMatcher] areComponentsMatching:[entity componentTypes]])
            [collection removeEntity:entity];
    };
}


- (NSArray *)entitiesForMatcher:(ESMatcher *)matcher
{
    return [[self collectionForMatcher:matcher] entities];
}


- (ESCollection *)collectionForMatcher:(ESMatcher *)matcher
{
    if (![_collections objectForKey:matcher])
    {
        ESCollection *collection = [[ESCollection alloc] initWithMatcher:matcher];

        for(ESEntity *entity in _entities)
        {
            if([collection.typeMatcher areComponentsMatching:[entity componentTypes]]) {
                [collection addEntity:entity];
            }
        };

        [_collections setObject:collection forKey:matcher];

        for (id type in matcher.componentTypes)
        {
            [[self internalCollectionsForType:type] addObject:collection];
        };
    }
    return [_collections objectForKey:matcher];
}

- (ESCollection *)collectionForTypes:(NSSet *)types
{
    if (types.count < 1)
        [NSException raise:@"Empty type set." format:@"A collection for an empty type-set cannot be provided."];
    return [self collectionForMatcher:[ESMatcher allOfSet:types]];
}


- (NSMutableSet *)internalCollectionsForType:(Class)type
{
    if (![_collectionsForType objectForKey:type])
        [_collectionsForType setObject:[NSMutableSet set] forKey:(id <NSCopying>) type];

    return [_collectionsForType objectForKey:type];
}

- (NSSet *)allEntities
{
    return [_entities copy];
}

@end
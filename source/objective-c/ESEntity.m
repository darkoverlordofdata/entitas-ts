#import "ESEntity+Internal.h"
#import "ESEntityRepository+Internal.h"

@implementation ESEntity
{
    NSMutableSet *_componentTypes;
    NSMutableDictionary *_components;
    ESEntityRepository *_repository;
    u_long _creationIndex;
}

- (instancetype)initWithIndex:(u_long)creationIndex inRepository:(ESEntityRepository *)repository {
    self = [super init];
    if (self) {
        _creationIndex = creationIndex;
        _repository = repository;
        _components = [NSMutableDictionary dictionary];
        _componentTypes = [NSMutableSet set];
    }

    return self;
}


- (void)addComponent:(NSObject <ESComponent> *)component
{
    if ([self hasComponentOfType:[component class]])
        [NSException raise:@"An entity cannot contain multiple components of the same type." format:@""];

    [_componentTypes addObject:[component class]];
    [_components setObject:component forKey:(id <NSCopying>) [component class]];
    [_repository componentOfType:[component class] hasBeenAddedToEntity:self];
}


- (void)exchangeComponent:(NSObject <ESComponent> *)component {
    [_componentTypes addObject:[component class]];
    [_components setObject:component forKey:(id <NSCopying>) [component class]];
    [_repository componentOfType:[component class] hasBeenExchangedInEntity:self];
}


- (BOOL)containsComponent:(NSObject <ESComponent> *)component
{
    return [_components objectForKey:[component class]] != nil;
}

- (BOOL)hasComponentOfType:(Class)type
{
    return [_componentTypes containsObject:type];
}

- (void)removeComponentOfType:(Class)type
{
    if ([self hasComponentOfType:type])
    {
        [_components removeObjectForKey:type];
        [_componentTypes removeObject:type];
        [_repository componentOfType:type hasBeenRemovedFromEntity:self];
    }
}

- (NSObject <ESComponent> *)componentOfType:(Class)type
{
    return [_components objectForKey:type];
}

- (BOOL)hasComponentsOfTypes:(NSSet *)types
{
    return [types isSubsetOfSet:_componentTypes];
}

- (NSSet *)componentTypes
{
    return _componentTypes;
}

- (u_long) creationIndex
{
    return _creationIndex;
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"[%@ %@]", NSStringFromClass([self class]), [_components description]];
}

@end

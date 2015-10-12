#import "ESSystems.h"

@implementation ESSystems
{
    NSMutableArray *_systems;
}

- (id)init
{
    self = [super init];
    if (self)
    {
        _systems = [NSMutableArray array];
    }

    return self;
}

- (void)addSystem:(NSObject <ESSystem> *)system
{
    [_systems addObject:system];
}

- (BOOL)containsSystem:(NSObject <ESSystem> *)system
{
    return [_systems containsObject:system];
}

- (void)removeSystem:(NSObject <ESSystem> *)system
{
    [_systems removeObject:system];
}

- (void)execute
{
    for (NSObject <ESSystem> *system in _systems)
        [system execute];
}

- (void)activate
{
    for (NSObject <ESSystem> *system in _systems)
        if ([system respondsToSelector:@selector(activate)])
            [system activate];
}

- (void)deactivate
{
    for (NSObject <ESSystem> *system in _systems)
        if ([system respondsToSelector:@selector(deactivate)])
            [system deactivate];
}

- (void)removeAllSystems
{
    [_systems removeAllObjects];
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"%@ %@", NSStringFromClass([self class]), [_systems description]];
}

@end
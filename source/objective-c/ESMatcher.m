#import "ESMatcher.h"
#import "ESCollection.h"


@interface ESSimpleMatcher : ESMatcher
- (id)initWithTypes:(NSSet *)types;
@end

@interface ESAllComponentTypes : ESSimpleMatcher
@end

@interface ESAnyComponentTypes : ESSimpleMatcher
@end



@implementation ESMatcher



+ (ESMatcher *)allOf:(Class)firstClass, ... {
    va_list args;
    va_start(args, firstClass);
    NSMutableSet *componentTypes = [NSMutableSet new];
    for (Class arg = firstClass; arg != nil; arg = va_arg(args, id)) {
        [componentTypes addObject:arg];
    }
    va_end(args);

    return [[ESAllComponentTypes alloc] initWithTypes:componentTypes];
}


+ (ESMatcher *)allOfSet:(NSSet *)componentTypes {
    return [[ESAllComponentTypes alloc] initWithTypes:componentTypes];
}


+ (ESMatcher *)anyOf:(Class)firstClass, ... {
    va_list args;
    va_start(args, firstClass);
    NSMutableSet *componentTypes = [NSMutableSet new];
    for (Class arg = firstClass; arg != nil; arg = va_arg(args, id)) {
        [componentTypes addObject:arg];
    }
    va_end(args);

    return [[ESAnyComponentTypes alloc] initWithTypes:componentTypes];
}


+ (ESMatcher *)anyOfSet:(NSSet *)componentTypes {
    return [[ESAnyComponentTypes alloc] initWithTypes:componentTypes];
}


+ (ESMatcher *)just:(Class)someClass {
    if (someClass == nil) {
        return [[ESAllComponentTypes alloc] initWithTypes:[NSSet set]];
    }
    return [[ESAllComponentTypes alloc] initWithTypes:[NSSet setWithObject:someClass]];
}






- (NSSet *)componentTypes {
    return nil;
}

- (NSString *)description {
    return [NSString stringWithFormat:@"<%@: %@>", NSStringFromClass([self class]), [self.componentTypes description]];
}

- (BOOL)areComponentsMatching:(NSSet *)componentTypes {
    @throw [NSException exceptionWithName:NSGenericException reason:@"Must to be implemented in subclass" userInfo:nil];
}


- (id)copyWithZone:(NSZone *)zone {
    id copy = [[[self class] alloc] init];
    return copy;
}



@end





@implementation ESSimpleMatcher {
    NSSet *_componentTypes;
}


- (BOOL)isEqual:(id)other {
    if (other == self) {
        return YES;
    }

    if (!other || ![[other class] isEqual:[self class]]) {
        return NO;
    }

    return [_componentTypes isEqual:[other componentTypes]];
}


- (id)initWithTypes:(NSSet *)types {
    self = [super init];
    if (self) {
        _componentTypes = types;
    }
    return self;
}


- (id)copyWithZone:(NSZone *)zone
{
    id copy = [[[self class] alloc] initWithTypes:[_componentTypes copyWithZone:zone]];
    return copy;
}


- (NSSet *)componentTypes {
    return _componentTypes;
}


@end


@implementation ESAllComponentTypes

- (BOOL)areComponentsMatching:(NSSet *)componentTypes {
    return [self.componentTypes isSubsetOfSet:componentTypes];
}



- (BOOL)isEqual:(id)other {
    if (other == self)
        return YES;
    if (!other || ![[other class] isEqual:[self class]])
        return NO;

    return [self isEqualToTypes:other];
}

- (BOOL)isEqualToTypes:(ESAllComponentTypes *)types {
    if (self == types)
        return YES;
    if (types == nil)
        return NO;
    if (![super isEqual:types])
        return NO;
    return YES;
}

- (NSUInteger)hash {
    return [self.class hash] + 31 * [self.componentTypes hash];
}


@end




@implementation ESAnyComponentTypes

- (BOOL)areComponentsMatching:(NSSet *)componentTypes {
    return [self.componentTypes intersectsSet:componentTypes];
}


- (BOOL)isEqual:(id)other {
    if (other == self)
        return YES;
    if (!other || ![[other class] isEqual:[self class]])
        return NO;

    return [self isEqualToTypes:other];
}

- (BOOL)isEqualToTypes:(ESAnyComponentTypes *)types {
    if (self == types)
        return YES;
    if (types == nil)
        return NO;
    if (![super isEqual:types])
        return NO;
    return YES;
}

- (NSUInteger)hash {
    return [self.class hash] + 31 * [self.componentTypes hash];
}


@end

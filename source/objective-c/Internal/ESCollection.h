#import "Entitas.h"


@protocol ESCollectionObserver;

typedef NS_OPTIONS(NSUInteger, ESEntityChange)
{
    ESEntityAdded   = 1 << 0,
    ESEntityRemoved   = 1 << 1
};

@interface ESCollection : NSObject

- (void)addObserver:(id <ESCollectionObserver>)observer forEvent:(ESEntityChange)event;

- (void)removeObserver:(id <ESCollectionObserver>)observer forEvent:(ESEntityChange)event;

- (NSArray *)entities;

@end


@protocol ESCollectionObserver

- (void)entity:(ESEntity *)changedEntity changedInCollection:(ESCollection *)collection withChangeType:(ESEntityChange)changeType;

@end

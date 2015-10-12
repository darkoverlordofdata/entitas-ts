#import <Foundation/Foundation.h>
#import "ESCollection.h"
#import "ESMatcher.h"

@interface ESCollection (Internal)

- (id)initWithTypes:(NSSet *)types;

- (id)initWithMatcher:(ESMatcher *)matcher;

- (ESMatcher *)typeMatcher;

- (void)addEntity:(ESEntity *)changedEntity;

- (void)removeEntity:(ESEntity *)entity;

- (void)exchangeEntity:(ESEntity *)entity;

@end
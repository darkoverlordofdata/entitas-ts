#import <Foundation/Foundation.h>


@class ESMatcher;
@class ESEntity;


@interface ESEntityRepository : NSObject

- (ESEntity *)createEntity;

- (void)destroyEntity:(ESEntity *)entity;

- (BOOL)containsEntity:(ESEntity *)entity;

- (NSArray *)entitiesForMatcher:(ESMatcher *)matcher;

- (NSSet *)allEntities;

@end
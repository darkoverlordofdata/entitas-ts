#import <Foundation/Foundation.h>
#import "ESCollection.h"

@class ESMatcher;
@class ESEntityRepository;


@protocol ESEntityRepositoryDelegate

- (void)executeWithEntities:(NSArray *)entities;

@end


@interface ESRepositoryObserver : NSObject

- (id)initWithRepository:(ESEntityRepository *)repository matcher:(ESMatcher *)matcher;
- (id)initWithRepository:(ESEntityRepository *)repository matcher:(ESMatcher *)matcher trigger:(ESEntityChange)changeTrigger;

- (NSArray *)drain;

- (void)deactivate;
- (void)activate;

@end

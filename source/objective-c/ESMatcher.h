#import <Foundation/Foundation.h>


@interface ESMatcher : NSObject <NSCopying>

+ (ESMatcher *)allOf:(Class)firstClass, ... NS_REQUIRES_NIL_TERMINATION;
+ (ESMatcher *)allOfSet:(NSSet *)componentTypes;

+ (ESMatcher *)anyOf:(Class)firstClass, ... NS_REQUIRES_NIL_TERMINATION;
+ (ESMatcher *)anyOfSet:(NSSet *)componentTypes;

+ (ESMatcher *)just:(Class)someClass;

- (BOOL)areComponentsMatching:(NSSet *)componentTypes;
- (NSSet *)componentTypes;

@end
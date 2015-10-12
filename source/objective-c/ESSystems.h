#import <Foundation/Foundation.h>
#import "ESSystem.h"

@interface ESSystems : NSObject <ESSystem>
- (void)addSystem:(NSObject <ESSystem> *)system;

- (BOOL)containsSystem:(NSObject <ESSystem> *)system;

- (void)removeSystem:(NSObject <ESSystem> *)system;

- (void)removeAllSystems;
@end
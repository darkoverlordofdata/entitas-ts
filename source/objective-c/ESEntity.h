#import <Foundation/Foundation.h>
#import "ESComponent.h"

@class ESEntityRepository;

// Handy macro to get an component from entity
// Example: PositionComponent *pos = getComponent(e, PositionComponent);
#define getComponent(entity, ComponentType) ((ComponentType *)[entity componentOfType:[ComponentType class]])

@interface ESEntity : NSObject

- (void)addComponent:(NSObject <ESComponent> *)component;

- (void)exchangeComponent:(NSObject <ESComponent> *)component;

- (void)removeComponentOfType:(Class)type;

- (NSObject <ESComponent> *)componentOfType:(Class)type;

- (BOOL)hasComponentOfType:(Class)type;

- (BOOL)hasComponentsOfTypes:(NSSet *)types;

- (NSSet *)componentTypes;

@end
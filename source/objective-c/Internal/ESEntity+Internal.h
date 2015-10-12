#import <Foundation/Foundation.h>
#import "Entitas.h"


@class ESEntityRepository;

@interface ESEntity (Internal)

- (instancetype)initWithIndex:(u_long)creationIndex inRepository:(ESEntityRepository *)repository;

- (BOOL)containsComponent:(NSObject <ESComponent> *)component;

- (u_long)creationIndex;

@end
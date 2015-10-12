@protocol ESSystem <NSObject>
- (void)execute;

@optional
- (void)activate;

- (void)deactivate;
@end
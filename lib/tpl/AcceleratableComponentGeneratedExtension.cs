using Entitas;

namespace Entitas {
    public partial class Entity {
        static readonly AcceleratableComponent acceleratableComponent = new AcceleratableComponent();

        public bool isAcceleratable {
            get { return HasComponent(CoreComponentIds.Acceleratable); }
            set {
                if (value != isAcceleratable) {
                    if (value) {
                        AddComponent(CoreComponentIds.Acceleratable, acceleratableComponent);
                    } else {
                        RemoveComponent(CoreComponentIds.Acceleratable);
                    }
                }
            }
        }

        public Entity IsAcceleratable(bool value) {
            isAcceleratable = value;
            return this;
        }
    }
}

    public partial class CoreMatcher {
        static IMatcher _matcherAcceleratable;

        public static IMatcher Acceleratable {
            get {
                if (_matcherAcceleratable == null) {
                    _matcherAcceleratable = Matcher.AllOf(CoreComponentIds.Acceleratable);
                }

                return _matcherAcceleratable;
            }
        }
    }

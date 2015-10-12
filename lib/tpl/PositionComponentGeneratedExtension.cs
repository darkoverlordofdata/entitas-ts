using System.Collections.Generic;

using Entitas;

namespace Entitas {
    public partial class Entity {
        public PositionComponent position { get { return (PositionComponent)GetComponent(CoreComponentIds.Position); } }

        public bool hasPosition { get { return HasComponent(CoreComponentIds.Position); } }

        static readonly Stack<PositionComponent> _positionComponentPool = new Stack<PositionComponent>();

        public static void ClearPositionComponentPool() {
            _positionComponentPool.Clear();
        }

        public Entity AddPosition(float newX, float newY, float newZ) {
            var component = _positionComponentPool.Count > 0 ? _positionComponentPool.Pop() : new PositionComponent();
            component.x = newX;
            component.y = newY;
            component.z = newZ;
            return AddComponent(CoreComponentIds.Position, component);
        }

        public Entity ReplacePosition(float newX, float newY, float newZ) {
            var previousComponent = hasPosition ? position : null;
            var component = _positionComponentPool.Count > 0 ? _positionComponentPool.Pop() : new PositionComponent();
            component.x = newX;
            component.y = newY;
            component.z = newZ;
            ReplaceComponent(CoreComponentIds.Position, component);
            if (previousComponent != null) {
                _positionComponentPool.Push(previousComponent);
            }
            return this;
        }

        public Entity RemovePosition() {
            var component = position;
            RemoveComponent(CoreComponentIds.Position);
            _positionComponentPool.Push(component);
            return this;
        }
    }
}

    public partial class CoreMatcher {
        static IMatcher _matcherPosition;

        public static IMatcher Position {
            get {
                if (_matcherPosition == null) {
                    _matcherPosition = Matcher.AllOf(CoreComponentIds.Position);
                }

                return _matcherPosition;
            }
        }
    }

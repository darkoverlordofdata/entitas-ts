namespace Entitas {
    public partial class Pool {
        public ISystem CreateAccelerateSystem() {
            return this.CreateSystem<AccelerateSystem>();
        }
    }
}
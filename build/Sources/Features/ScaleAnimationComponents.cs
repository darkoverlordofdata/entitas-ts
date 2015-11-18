using Entitas;

[Core]
public class ScaleAnimationComponent : IComponent {
    public float min;
    public float max;
    public float speed;
    public bool repeat;
    public bool active;
}
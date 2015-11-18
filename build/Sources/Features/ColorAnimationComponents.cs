using Entitas;

[Core]
public class ColorAnimationComponent : IComponent {
    public float redMin;
    public float redMax;
    public float redSpeed;
    public float greenMin;
    public float greenMax;
    public float greenSpeed;
    public float blueMin;
    public float blueMax;
    public float blueSpeed;
    public float alphaMin;
    public float alphaMax;
    public float alphaSpeed;
    public bool redAnimate;
    public bool greenAnimate;
    public bool blueAnimate;
    public bool alphaAnimate;
    public bool repeat;
}
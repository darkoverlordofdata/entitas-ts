
languages supported:

    html5 - this is the default. Generates a combination of typescript
            and javascript. Bosco+pixi.js+howler replace Unity for web
            
    csharp - generates components and systems only. Then use Entitas-CSharp
            to finish generating helper code in unity. WIP - used once to migrate 
            Shmup Warz from web to unity
            
    fsharp - generates fsharp code for ecs-fsharp, which is entitas based. 
    
    nim - works on desktop. Has performance problems.
    vala - works on desktop. Has performance problems.
    kotlin - works with libGDX. 
    
    
Bosco.dll for Unity to provide some extra utilities from web.

CSharp uses standard Entitas-CSharp

FSharp uses FSharp.Core.dll & ecs.fs (Bosco.ECS.dll?)


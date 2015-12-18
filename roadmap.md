
languages supported:

    html5 - this is the default. Generates a combination of typescript
            and javascript. Bosco+pixi.js+howler replace Unity for web
            
    csharp - generates components and systems only. Then use Entitas-CSharp
            to finish generating helper code in unity. WIP - used once to migrate 
            Shmup Warz from web to unity
            
    fsharp - Starting... generates fsharp code for ecs-fsharp, which is entitas based. 
    
    nemerle - someday...a lot of possiblity. nemerle replaces roslyn as code generator
    
    funscript - maybe...if it works, might be one code base for both web & unity! 
    
    
Bosco.dll for Unity to provide some extra utilities from web.

CSharp uses standard Entitas-CSharp

FSharp uses FSharp.Core.dll & ecs.fs (Bosco.ECS.dll?)

Nemerle uses Nermerle.dll ...
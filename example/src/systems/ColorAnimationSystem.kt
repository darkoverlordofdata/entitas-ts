package example

/**
 * Entitas Generated Systems for example
 *
 */

import com.darkoverlordofdata.entitas.ecs.ISetPool
import com.darkoverlordofdata.entitas.ecs.IExecuteSystem
import com.darkoverlordofdata.entitas.ecs.IInitializeSystem
import com.darkoverlordofdata.entitas.ecs.IReactiveExecuteSystem
import com.darkoverlordofdata.entitas.ecs.IMultiReactiveSystem
import com.darkoverlordofdata.entitas.ecs.IReactiveSystem
import com.darkoverlordofdata.entitas.ecs.IEnsureComponents
import com.darkoverlordofdata.entitas.ecs.IExcludeComponents
import com.darkoverlordofdata.entitas.ecs.IClearReactiveSystem
import com.darkoverlordofdata.entitas.ecs.Pool

class ColorAnimationSystem() 
    : IExecuteSystem, ISetPool { 
    override fun execute() {
    }
    override fun setPool(pool: Pool) {
    }
}
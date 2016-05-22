package {{ namespace }} 

import com.darkoverlordofdata.entitas.Pool
import com.darkoverlordofdata.entitas.Group
import com.darkoverlordofdata.entitas.Entity
import com.darkoverlordofdata.entitas.Matcher
import com.darkoverlordofdata.entitas.Exception
import com.darkoverlordofdata.entitas.TriggerOnEvent
{% for iface in interfaces %}\import import com.darkoverlordofdata.entitas.{{ iface }}{% endfor %}   

class #{name}(pool:Pool) : {% for iface in interfaces %}{{ iface }}{% if forloop.index <  forloop.length %},{% endif %}{% endfor %} {
{% for iface in interfaces %}
{% case iface %}
{% when "ISetPool" %}   val pool = pool
{% endcase %}
{% endfor %}
{% for iface in interfaces %}
{% case iface %}
{% when "IReactiveSystem" %}   val triggers:Array<TriggerOnEvent>
{% when "IMultiReactiveSystem" %}   val triggers:Array<TriggerOnEvent>
{% when "IReactiveExecuteSystem" %}    val trigger: TriggerOnEvent
{% when "IExecuteSystem" %}     override fun execute() {}
{% when "IInitializeSystem" %}  override fun initialize() {}
{% when "IEnsureComponents" %}  val ensureComponents: IMatcher
{% when "IExcludeComponents" %} val excludeComponents: IMatcher
{% when "IClearReactiveSystem" %}   val clearAfterExecute:Boolean
{% when "ISetPool" %}   override fun setPool(pool: Pool) {}
{% endcase %}
{% endfor %}
}
module {{ namespace }} {

    import Matcher = entitas.Matcher;
    import ISystem = entitas.ISystem;
    import IMatcher = entitas.IMatcher;
    import IComponent = entitas.IComponent;

    export enum CoreComponentIds {
        {% for component in components %}
        {{ component.name }},{% endfor %}
        TotalComponents
    }
    {% for component in components %}
    export class {{ component.name }}Component implements IComponent { {% for property in component.properties %}
        {{ property.name }}:{{ property.type }};{% endfor %}
    }{% endfor %}

    export class Entity extends entitas.Entity {
        {% for component in components %}
        {% if component.properties == false %}

        static #{name}Component:#{Name}Component = new #{Name}Component();
        get is#{Name}():boolean {
        return this.hasComponent(CoreComponentIds.#{Name});
        }
        set is#{Name}(value:boolean) {
        if (value !== this.is#{Name}) {
        if (value) {
        this.addComponent(CoreComponentIds.#{Name}, Entity.#{name}Component);
        } else {
        this.removeComponent(CoreComponentIds.#{Name});
        }
        }
        }
        set#{Name}(value:boolean) {
        this.is#{Name} = value;
        return this;
        }

        {% else %}

        {% endif %}
        {% endfor %}
    }
}

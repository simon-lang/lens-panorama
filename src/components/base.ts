import { Component, Prop, Vue } from 'vue-property-decorator'

// import './my-component.scss'

@Component({
    template: require('./my-component.html'),
    name: 'my-component',
    components: {}
})
export class MyComponent extends Vue {
}

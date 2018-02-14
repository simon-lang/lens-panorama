import { expect } from 'chai'
import { ClientComponent } from './client'
import { ComponentTest } from '../../util/component-test'

describe('Home component', () => {
  let directiveTest: ComponentTest

  beforeEach(() => {
    directiveTest = new ComponentTest('<div><home></home></div>', { 'home': ClientComponent })
  })

  it('should render correct contents', async () => {
    directiveTest.createComponent()
    await directiveTest.execute((vm) => {
      const mode = process.env.ENV
      expect(vm.$el.querySelector('.mode').textContent).to.equal(`${mode} mode`)
      expect(vm.$el.querySelector('.package').textContent).to.equal('vue-webpack-typescript')
    })
  })
})

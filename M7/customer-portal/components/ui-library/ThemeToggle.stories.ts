import ThemeToggle from './ThemeToggle.vue'

export default {
  title: 'UI Library/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    docs: {
      description: {
        component:
          'ThemeToggle toggles between light and dark mode. Note: This will affect the Storybook preview color mode if supported.'
      }
    }
  }
}

export const Default = () => ({
  components: { ThemeToggle },
  template: '<ThemeToggle />',
})

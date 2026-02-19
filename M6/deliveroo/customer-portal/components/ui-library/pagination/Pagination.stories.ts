import type { Meta, StoryFn } from '@storybook/vue3'
import Pagination from './Pagination.vue'

export default {
  title: 'UI Library/Pagination',
  component: Pagination,
  argTypes: {
    pagination: { control: 'object', description: 'Pagination data object' },
    previousPage: { action: 'previousPage' },
    nextPage: { action: 'nextPage' },
    goToPage: { action: 'goToPage' }
  }
} as Meta<typeof Pagination>

const Template: StoryFn<typeof Pagination> = (args) => ({
  components: { Pagination },
  setup() { return { args } },
  template: '<Pagination v-bind="args" @previousPage="args.previousPage" @nextPage="args.nextPage" @goToPage="args.goToPage" />'
})

export const Default = Template.bind({})
Default.args = {
  pagination: {
    currentPage: 1,
    totalPages: 5,
    total: 50,
    startIndex: 0,
    endIndex: 9,
    visiblePages: [1,2,3,4,5]
  }
}

export const MiddlePage = Template.bind({})
MiddlePage.args = {
  pagination: {
    currentPage: 3,
    totalPages: 5,
    total: 50,
    startIndex: 20,
    endIndex: 29,
    visiblePages: [1,2,3,4,5]
  }
}

export const LastPage = Template.bind({})
LastPage.args = {
  pagination: {
    currentPage: 5,
    totalPages: 5,
    total: 50,
    startIndex: 40,
    endIndex: 49,
    visiblePages: [1,2,3,4,5]
  }
} 
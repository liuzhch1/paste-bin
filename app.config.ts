export default defineAppConfig({
  ui: {
    select: {
      color: {
        white: {
          outline:
            'bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-gray-350 dark:focus:ring-gray-350',
        },
      },
      default: {
        color: 'white',
      },
    },
    notification: {
      progress: {
        base: 'bg-white dark:bg-gray-900',
      },
    },
  },
})

/* global document */

import $ from 'jquery'
import registerPlugin from './register-plugin'

class NotificationPane {
  constructor(element) {
    this.$element = $(element)

    const $element = this.$element

    this.path = {
      info: $element.data('notification-info'),
      success: $element.data('notification-success'),
      error: $element.data('notification-error'),
    }

    // @path.info = @$element.data 'notification-info'
    // @path.success = @$element.data 'notification-success'
    // @path.error = @$element.data 'notification-error'
  }

  displayNotification(notification) {
    if (notification == null) {
      return
    }

    const $notification = $('<div class="notifications__item" ></div>')
    let $icon = null

    if (notification.modifier) {
      $notification.addClass(`notifications__item--${notification.modifier}`)
      $icon = `<svg class="icon notifications__item__icon">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${this.path[notification.modifier]}"></use>
      </svg>`
    }

    const $iconContainer = $('<div class="notifications__item__icon-container">')

    $iconContainer.append($icon)
    $notification.append($iconContainer)

    $notification.on('click', () => {
      this.hideNotification($notification)
    })

    const $content = $('<div class="notifications__item__content"></div>')

    if (notification.html === true) {
      $content.html(notification.content)
    } else {
      $content.text(notification.content)
    }

    $notification.append($content)

    let timeout = 2000

    if (typeof notification.timeout === 'number') {
      ({ timeout } = notification)
    }

    setTimeout((() => {
      this.hideNotification($notification)
    }), timeout)

    this.$element.append($notification)
  }

  hideNotification($notification) {
    $notification.addClass('notifications__item--fade-out')
    setTimeout((() => $notification.remove()), 500)
  }
}

// Plugin definition
registerPlugin('notification', NotificationPane, {
  customInstantiationCB: (PluginWrapper) => {
    $(document).on('click.axa.notification.data-api', '[data-notification]', function (e) {
      e.preventDefault()

      const $this = $(this)
      const $target = $($this.data('notification'))

      PluginWrapper.call($target, {
        content: $this.data('notification-content'),
        modifier: $this.data('notification-modifier'),
      })
    })
  },
  afterInstantiationCB: (instance, options) => {
    instance.displayNotification(options)
  },
})

//! Copyright AXA Versicherungen AG 2015

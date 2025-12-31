import classNames from 'classnames'
import React from 'react'
import { useInView } from 'react-intersection-observer'

const items = [
  // {
  //   url: require('@site/static/img/web/info.png').default,
  //   position: 'right',
  //   link: 'https://github.com/lemonade-lab/alemongo'
  // },
  // {
  //   url: require('@site/static/img/dt/cat.png').default,
  //   position: 'left',
  //   link: 'https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone'
  // },
  // {
  //   url: require('@site/static/img/dt/home.png').default,
  //   position: 'right',
  //   link: 'https://github.com/lemonade-lab/alemondesk'
  // }
]

export default function HomePage(): JSX.Element {
  return (
    <main className="flex justify-around py-8">
      <div className="container">
        <div className="flex flex-col items-center w-full gap-6 py-8">
          {items.map((item, index) => {
            const [view, inView] = useInView({
              triggerOnce: true,
              threshold: 0.1
            })
            return (
              <div
                key={index}
                ref={view}
                onClick={() => {
                  window.open(item.link, '_blank')
                }}
                className={classNames(
                  `flex flex-col md:flex-row cursor-pointer  gap-8`,
                  {
                    'md:flex-row-reverse':
                      item.position === 'left'
                  },
                  'animate__animated  duration-[1000ms]',
                  {
                    'animate__fadeInLeft opacity-100':
                      item.position === 'left' && inView,
                    'animate__fadeInRight opacity-100':
                      item.position === 'right' && inView,
                    'opacity-0': !inView
                  }
                )}
              >
                <img
                  className="md:w-[40rem] rounded-lg md:rounded-2xl border shadow-xl"
                  src={item.url}
                />
                <div className="flex flex-col gap-2 items-center justify-center">
                  <div className="text-3xl">
                    {item.title}
                  </div>
                  <div className="text-slate-600">
                    {item.docs}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

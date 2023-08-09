import PromiseFactory from './factory'

export const Promise = PromiseFactory({
  isUseNativePromises: process.env.NATIVE_PROMISES === 'true',
})

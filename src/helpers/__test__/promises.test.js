import { makeCancelable } from '../promises'
import Promise from 'bluebird'

function reflect(promise) {
  return Promise.resolve(promise).reflect();
}

describe('promises', () => {
  describe('makeCancelable', () => {
    describe('Promise resolve', () => {
      let resolveFn
      let p
      beforeEach(() => {
        p = makeCancelable(new Promise((resolve, reject) => resolveFn = resolve))
      })

      it('should resolve value when hasCanceled_ is false', () => {
        resolveFn('foo')
        return reflect(p.promise).then(inspection => {
          expect(inspection.isFulfilled()).toBe(true)
          expect(inspection.value()).toBe('foo')
        })
      })

      it('should reject isCanceled when hasCanceled_ is true', () => {
        p.cancel()
        resolveFn('foo')
        return reflect(p.promise).then(inspection => {
          expect(inspection.isRejected()).toBe(true)
          expect(inspection.reason().isCanceled).toBe(true)
        })
      })
    })

    describe('Promise reject', () => {
      let rejectFn
      let p
      beforeEach(() => {
        p = makeCancelable(new Promise((resolve, reject) => rejectFn = reject))
      })

      it('should reject error when hasCanceled_ is false', () => {
        rejectFn('foo')
        return reflect(p.promise).then(inspection => {
          expect(inspection.isRejected()).toBe(true)
          expect(inspection.reason()).toBe('foo')
          expect(inspection.reason().isCanceled).toBeUndefined()
        })
      })

      it('should reject isCanceled when hasCanceled_ is true', () => {
        p.cancel()
        rejectFn('foo')
        return reflect(p.promise).then(inspection => {
          expect(inspection.isRejected()).toBe(true)
          expect(inspection.reason().isCanceled).toBe(true)
        })
      })
    })
  })
})
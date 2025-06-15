import { renderHook, act } from '@testing-library/react';
import { useToast, toast, __test__ } from '../useToast';

// Destructure test utilities
const { toastTimeouts, memoryState, genId, reducer } = __test__;

// Import constants from the module
const TOAST_REMOVE_DELAY = 1000000; // Match the value from useToast.ts

describe('useToast', () => {
  // Reset state before each test
  beforeEach(() => {
    // Clear the memory state
    jest.useFakeTimers();
    // Reset state for testing
    memoryState.toasts = [];
    // @ts-ignore - resetting private counter for testing
    __test__.count = 0;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('genId', () => {
    it('should generate unique IDs', () => {
      const id1 = genId();
      const id2 = genId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+$/);
    });
  });

  describe('reducer', () => {
    it('should handle ADD_TOAST action', () => {
      const initialState = { toasts: [] };
      const action = {
        type: 'ADD_TOAST' as const,
        toast: { id: '1', title: 'Test Toast' },
      };

      const newState = reducer(initialState, action);
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].title).toBe('Test Toast');
    });

    it('should respect TOAST_LIMIT when adding toasts', () => {
      const initialState = {
        toasts: Array(5).fill({ id: 'existing', title: 'Existing Toast' }),
      };
      const action = {
        type: 'ADD_TOAST' as const,
        toast: { id: 'new', title: 'New Toast' },
      };

      const newState = reducer(initialState, action);
      expect(newState.toasts).toHaveLength(1); // Limited by TOAST_LIMIT
      expect(newState.toasts[0].title).toBe('New Toast');
    });

    it('should handle UPDATE_TOAST action', () => {
      const initialState = {
        toasts: [{ id: '1', title: 'Old Title' }],
      };
      const action = {
        type: 'UPDATE_TOAST' as const,
        toast: { id: '1', title: 'Updated Title' },
      };

      const newState = reducer(initialState, action);
      expect(newState.toasts[0].title).toBe('Updated Title');
    });

    it('should handle DISMISS_TOAST action', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true },
        ],
      };
      const action = {
        type: 'DISMISS_TOAST' as const,
        toastId: '1',
      };

      const newState = reducer(initialState, action);
      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(true);
    });

    it('should handle DISMISS_TOAST without ID to dismiss all', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true },
        ],
      };
      const action = {
        type: 'DISMISS_TOAST' as const,
      };

      const newState = reducer(initialState, action);
      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(false);
    });

    it('should handle REMOVE_TOAST action', () => {
      const initialState = {
        toasts: [
          { id: '1', title: 'Toast 1' },
          { id: '2', title: 'Toast 2' },
        ],
      };
      const action = {
        type: 'REMOVE_TOAST' as const,
        toastId: '1',
      };

      const newState = reducer(initialState, action);
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });
  });

  describe('toast function', () => {
    it('should add a toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: 'Test Toast' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Test Toast');
    });

    it('should update a toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        const t = toast({ title: 'Initial' });
        t.update({ title: 'Updated', id: t.id });
      });

      expect(result.current.toasts[0].title).toBe('Updated');
    });

    it('should dismiss a toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        const t = toast({ title: 'Test' });
        t.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe('useToast hook', () => {
    it('should provide toast function and state', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current).toHaveProperty('toasts');
      expect(result.current).toHaveProperty('toast');
      expect(result.current).toHaveProperty('dismiss');
      expect(typeof result.current.toast).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
    });

    it('should update when toast is added', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Hook Test' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Hook Test');
    });

    it('should dismiss toast when onOpenChange is called with false', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Test Dismiss' });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        const toast = result.current.toasts.find((t) => t.id === toastId);
        toast?.onOpenChange?.(false);
      });

      expect(result.current.toasts.find((t) => t.id === toastId)?.open).toBe(
        false
      );
    });

    it('should clean up timeouts when toast is dismissed', () => {
      const { result } = renderHook(() => useToast());
      let toastId: string;
      
      act(() => {
        const t = result.current.toast({ title: 'Test Timeout' });
        t.dismiss();
        toastId = t.id;
      });

      // The toast should be in the dismissed state
      expect(result.current.toasts[0].open).toBe(false);
      
      // Fast-forward time to trigger the timeout
      act(() => {
        jest.advanceTimersByTime(TOAST_REMOVE_DELAY);
      });
      
      // The toast should be removed after the delay
      expect(result.current.toasts.some(t => t.id === toastId)).toBe(false);
    });
  });
});

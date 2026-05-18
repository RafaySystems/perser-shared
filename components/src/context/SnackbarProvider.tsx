// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useCallback } from 'react';
import { toast, Toaster } from 'sonner';

export type SnackbarKey = string | number;
export type SnackbarMessage = React.ReactNode;
export interface SnackbarOptions {
  duration?: number;
  description?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export interface SnackbarContext {
  errorSnackbar: EnqueueFunction;
  infoSnackbar: EnqueueFunction;
  warningSnackbar: EnqueueFunction;
  successSnackbar: EnqueueFunction;
  exceptionSnackbar: (error: unknown, options?: SnackbarOptions) => void;
  closeSnackbar: (id?: SnackbarKey) => void;
  enqueueSnackbar: (message: SnackbarMessage, options?: SnackbarOptions & { variant?: string }) => void;
}

type EnqueueFunction = (message: SnackbarMessage, options?: SnackbarOptions) => void;

/**
 * Application-wide provider for showing toasts. Drop-in replacement for the
 * previous notistack-based SnackbarProvider.
 */
export function SnackbarProvider({ children }: { children?: React.ReactNode }): React.ReactElement {
  return (
    <>
      {children}
      <Toaster richColors position="bottom-right" />
    </>
  );
}

/**
 * Returns toast helpers with the same API surface as the previous notistack useSnackbar().
 */
export function useSnackbar(): SnackbarContext {
  const errorSnackbar: EnqueueFunction = useCallback((message, options) => {
    toast.error(message as string, { description: options?.description as string, duration: options?.duration, action: options?.action });
  }, []);

  const infoSnackbar: EnqueueFunction = useCallback((message, options) => {
    toast.info(message as string, { description: options?.description as string, duration: options?.duration, action: options?.action });
  }, []);

  const warningSnackbar: EnqueueFunction = useCallback((message, options) => {
    toast.warning(message as string, { description: options?.description as string, duration: options?.duration, action: options?.action });
  }, []);

  const successSnackbar: EnqueueFunction = useCallback((message, options) => {
    toast.success(message as string, { description: options?.description as string, duration: options?.duration, action: options?.action });
  }, []);

  const exceptionSnackbar = useCallback(
    (error: unknown, options?: SnackbarOptions) => {
      const message = error instanceof Error ? error.message : `An unexpected error occurred: ${error}`;
      errorSnackbar(message, options);
    },
    [errorSnackbar]
  );

  const closeSnackbar = useCallback((id?: SnackbarKey) => {
    if (id !== undefined) toast.dismiss(id as string | number);
    else toast.dismiss();
  }, []);

  const enqueueSnackbar = useCallback(
    (message: SnackbarMessage, options?: SnackbarOptions & { variant?: string }) => {
      const variant = options?.variant;
      if (variant === 'error') errorSnackbar(message, options);
      else if (variant === 'warning') warningSnackbar(message, options);
      else if (variant === 'success') successSnackbar(message, options);
      else infoSnackbar(message, options);
    },
    [errorSnackbar, infoSnackbar, warningSnackbar, successSnackbar]
  );

  return { errorSnackbar, infoSnackbar, warningSnackbar, successSnackbar, exceptionSnackbar, closeSnackbar, enqueueSnackbar };
}

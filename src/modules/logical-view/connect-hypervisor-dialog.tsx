'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { FormType, useAppForm } from '@/shared/tanstack-form/form';
import React, { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  connectHypervisorCredentialsSchema,
  connectHypervisorNodesSchema,
  connectHypervisorSchema,
} from './_schema/schema';
import { type HypervisorNode, type HypervisorVendor } from './_types/logical-view';
import { useParams } from 'next/navigation';
import { useCreateServer } from './_hooks/use-create-server';
import { useGetServerNodes } from './_hooks/use-get-server-nodes';
import { defineStepper } from '@stepperize/react';
import CredentialsStep from './credentials-step';
import NodesStep from './nodes-step';

type NodeConfig = {
  name: string;
  deviceTemplateId: string;
  connectPortIds: string[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId?: string;
};

const { useStepper } = defineStepper(
  { id: 'credentials', title: 'Credentials' },
  { id: 'nodes', title: 'Nodes' }
);

const ConnectHypervisorDialog = ({ open, onOpenChange, deviceId }: Props) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { mutateAsync: createServer } = useCreateServer();

  const stepper = useStepper();
  const { mutateAsync: fetchNodes, isPending: isFetchingNodes } = useGetServerNodes();
  const [hypervisorNodes, setHypervisorNodes] = useState<HypervisorNode[]>([]);
  const lastFetchedCredentials = useRef<{ apiUrl: string; apiKey: string; vendor: string } | null>(
    null
  );

  useEffect(() => {
    if (open) {
      stepper.reset();
      setHypervisorNodes([]);
      lastFetchedCredentials.current = null;
    }
  }, [open]);

  const form = useAppForm({
    defaultValues: {
      apiKey: '',
      vendor: '' as HypervisorVendor,
      apiUrl: '',
      nodes: [] as NodeConfig[],
    },
    validators: {
      onSubmit: connectHypervisorSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createServer({
          projectId,
          data: value,
        });

        toast.success('Hypervisor connected successfully.');
        onOpenChange(false);

        form.reset();
      } catch {
        toast.error('Failed to connect hypervisor. Please try again.');
      }
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleNext = useCallback(async () => {
    const formValues = form.state.values as Record<string, unknown>;
    const result = connectHypervisorCredentialsSchema.safeParse(formValues);

    if (!result.success) {
      await Promise.allSettled(
        result.error.issues.map((issue) => {
          const fieldName = issue.path[0];
          if (typeof fieldName === 'string') {
            return form.validateField(fieldName as keyof typeof form.state.values, 'submit');
          }
        })
      );
      return;
    }

    const { apiUrl, apiKey, vendor } = result.data;
    const last = lastFetchedCredentials.current;
    const isSame =
      last && last.apiUrl === apiUrl && last.apiKey === apiKey && last.vendor === vendor;

    if (!isSame) {
      try {
        const nodes = await fetchNodes({ apiUrl, apiKey, vendor });
        lastFetchedCredentials.current = { apiUrl, apiKey, vendor };
        setHypervisorNodes(nodes);
        form.setFieldValue(
          'nodes',
          nodes.map((n) => ({ name: n.name, deviceTemplateId: '', connectPortIds: [] }))
        );
      } catch {
        toast.error('Failed to fetch nodes. Please check your credentials.');
        return;
      }
    }

    stepper.next();
  }, [stepper, form, fetchNodes]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        form.reset();
        stepper.reset();
        setHypervisorNodes([]);
        lastFetchedCredentials.current = null;
      }
      onOpenChange(newOpen);
    },
    [form, stepper, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Connect to a hypervisor</DialogTitle>
            <DialogDescription>
              {stepper.isFirst
                ? 'Enter your hypervisor credentials.'
                : 'Configure each node below.'}
            </DialogDescription>
          </DialogHeader>

          {stepper.switch({
            credentials: () => <CredentialsStep form={form as unknown as FormType} />,
            nodes: () => (
              <NodesStep
                form={form as unknown as FormType}
                deviceId={deviceId ?? ''}
                hypervisorNodes={hypervisorNodes}
              />
            ),
          })}

          <DialogFooter>
            {stepper.isFirst ? (
              <>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" disabled={isFetchingNodes} onClick={handleNext}>
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => stepper.prev()}>
                  Back
                </Button>
                <Button type="submit">Connect</Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectHypervisorDialog;

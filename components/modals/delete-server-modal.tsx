'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '../../hooks/use-modal-store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw, Variable } from 'lucide-react';
import useOrigin from '../../hooks/use-origin';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const DeleteServerModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === 'deleteServer';
	const { server } = data;

	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/servers/${server?.id}`);
			onClose();
			router.refresh();
			router.push('/');
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="p-0 overflow-hidden text-black bg-white">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-2xl text-center text-bold">Delete Server</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure you want to do this? <br />
						<span className="font-semibold text-indigo-500">{server?.name}</span> will be permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="px-6 py-4 bg-gray-100">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} onClick={onClose} variant="ghost">
							Cancel
						</Button>
						<Button disabled={isLoading} onClick={onClick} variant="primary">
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

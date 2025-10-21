// import * as React from 'react';
// import { Button } from '@/shared/components/ui/button';
// import { Separator } from '@/shared/components/ui/separator';
// import { Label } from '@/shared/components/ui/label';

// const StepperNavigation = () => {
//   return (
//     <div className="group my-4 hidden sm:block" aria-label="Checkout Steps">
//       <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
//         {stepper.all.map((step, idx, arr) => (
//           <React.Fragment key={step.id}>
//             <li className="flex flex-shrink-0 items-center gap-4">
//               <Button
//                 type="button"
//                 role="tab"
//                 variant={idx <= currentIndex ? 'default' : 'secondary'}
//                 aria-current={stepper.current.id === step.id ? 'step' : undefined}
//                 aria-posinset={idx + 1}
//                 aria-setsize={steps.length}
//                 aria-selected={stepper.current.id === step.id}
//                 className="flex size-10 items-center justify-center rounded-full"
//                 onClick={() => handleGoToStep(step.id)}
//               >
//                 {idx + 1}
//               </Button>
//               <Label className="text-sm font-medium">{step.title}</Label>
//             </li>
//             {idx < arr.length - 1 && (
//               <Separator className={`flex-1 ${idx < currentIndex ? 'bg-primary' : 'bg-muted'}`} />
//             )}
//           </React.Fragment>
//         ))}
//       </ol>
//     </div>
//   );
// };

// export default StepperNavigation;

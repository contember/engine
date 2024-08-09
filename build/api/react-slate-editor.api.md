## API Report File for "@contember/react-slate-editor"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { Context } from 'react';
import { Editor } from 'slate';
import { EditorElement } from '@contember/react-slate-editor-base';
import { EditorPlugin } from '@contember/react-slate-editor-base';
import { Element as Element_2 } from 'slate';
import { EntityAccessor } from '@contember/binding';
import { EntityAccessor as EntityAccessor_2 } from '@contember/react-binding';
import { EntityId } from '@contember/binding';
import { EntityId as EntityId_2 } from '@contember/react-binding';
import type { FunctionComponent } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { NamedExoticComponent } from 'react';
import { Path } from 'slate';
import { Range as Range_2 } from 'slate';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
import { SugaredRelativeEntityList } from '@contember/binding';
import { SugaredRelativeSingleField } from '@contember/react-binding';
import { SugaredRelativeSingleField as SugaredRelativeSingleField_2 } from '@contember/binding';

// @public
export const Block: FunctionComponent<BlockProps>;

// @public
export const BlockContent: (props: ContentOutletProps) => any;

// @public (undocumented)
export const BlockEditor: NamedExoticComponent<BlockEditorProps>;

// @public (undocumented)
export interface BlockEditorProps {
    // (undocumented)
    children?: ReactNode;
    // (undocumented)
    field: SugaredRelativeSingleField['field'];
    // (undocumented)
    plugins?: EditorPlugin[];
}

// @public (undocumented)
export interface BlockProps {
    // (undocumented)
    children?: ReactNode;
    // (undocumented)
    name: string;
    // (undocumented)
    render: ({}: BlockRendererProps) => ReactNode;
}

// @public (undocumented)
export type BlockRendererProps = RenderElementProps & {
    isVoid: boolean;
};

// @public (undocumented)
export interface ContentOutletProps {
}

// @internal (undocumented)
export const EditorBlockElementContext: Context<RenderElementProps>;

// Warning: (ae-forgotten-export) The symbol "GetReferencedEntity" needs to be exported by the entry point index.d.ts
//
// @internal (undocumented)
export const EditorGetReferencedEntityContext: Context<GetReferencedEntity>;

// @public (undocumented)
export const EditorInlineReferencePortal: (props: EditorInlineReferenceTriggerProps) => JSX_2.Element | null;

// @public (undocumented)
export interface EditorInlineReferenceTriggerProps {
    // (undocumented)
    children: ReactNode;
    // (undocumented)
    initializeReference?: EntityAccessor.BatchUpdatesHandler;
    // (undocumented)
    referenceType: string;
}

// @public (undocumented)
export interface EditorReferenceMethods {
    // Warning: (ae-forgotten-export) The symbol "CreateElementReferences" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    createElementReference: CreateElementReferences;
    // Warning: (ae-forgotten-export) The symbol "InsertElementWithReference" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    insertElementWithReference: InsertElementWithReference;
}

// @internal (undocumented)
export const EditorReferenceMethodsContext: Context<EditorReferenceMethods>;

// @public (undocumented)
export const EditorReferenceTrigger: ({ referenceType, ...props }: EditorReferenceTriggerProps) => JSX_2.Element;

// @public (undocumented)
export interface EditorReferenceTriggerProps {
    // (undocumented)
    children: ReactElement;
    // (undocumented)
    referenceType: string;
}

// @public (undocumented)
export interface InitializeReferenceContentProps {
    // (undocumented)
    editor: Editor;
    // (undocumented)
    onCancel: () => void;
    // (undocumented)
    onSuccess: (options?: {
        createElement?: Partial<Element_2>;
    }) => void;
    // (undocumented)
    referenceId: EntityId;
    // (undocumented)
    selection: Range_2 | null;
}

// @public (undocumented)
export interface ReferencesPluginArgs {
    // (undocumented)
    discriminationField: SugaredRelativeSingleField_2['field'];
    // (undocumented)
    field: SugaredRelativeEntityList['field'];
}

// @public (undocumented)
export const useEditorBlockElement: () => RenderElementProps;

// @public (undocumented)
export const useEditorGetReferencedEntity: () => GetReferencedEntity;

// @public (undocumented)
export const useEditorReferenceMethods: () => EditorReferenceMethods;

// @public (undocumented)
export const withReferences: (args: ReferencesPluginArgs) => EditorPlugin;

// @public (undocumented)
export const withSortable: ({ render: Sortable }: {
    render: (props: {
        element: EditorElement;
        children: ReactNode;
    }) => ReactNode;
}) => EditorPlugin;


export * from "@contember/react-slate-editor-base";

// (No @packageDocumentation comment for this package)

```
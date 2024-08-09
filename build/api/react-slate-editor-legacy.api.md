## API Report File for "@contember/react-slate-editor-legacy"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ChildrenAnalyzer } from '@contember/react-multipass-rendering';
import { ComponentType } from 'react';
import { Context } from 'react';
import { CreateEditorPublicOptions } from '@contember/react-slate-editor-base';
import { Descendant } from 'slate';
import { Editor } from 'slate';
import { EditorElementPlugin } from '@contember/react-slate-editor-base';
import { Element as Element_2 } from 'slate';
import { EntityAccessor } from '@contember/react-binding';
import { EntityAccessor as EntityAccessor_2 } from '@contember/binding';
import { EntityId } from '@contember/react-binding';
import { EntityId as EntityId_2 } from '@contember/binding';
import { Environment } from '@contember/react-binding';
import { FieldAccessor } from '@contember/react-binding';
import { FieldValue } from '@contember/react-binding';
import { FunctionComponent } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { NamedExoticComponent } from 'react';
import { Node as Node_2 } from 'slate';
import type { OptionallyVariableFieldValue } from '@contember/react-binding';
import { OptionallyVariableFieldValue as OptionallyVariableFieldValue_2 } from '@contember/binding';
import { Path } from 'slate';
import { PathRef } from 'slate';
import { Range as Range_2 } from 'slate';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { RelativeSingleField } from '@contember/react-binding';
import { RenderElementProps } from 'slate-react';
import * as Slate from 'slate';
import { SugaredFieldProps } from '@contember/react-binding';
import { SugaredRelativeEntityList } from '@contember/react-binding';
import { SugaredRelativeSingleField } from '@contember/react-binding';

// Warning: (ae-unresolved-link) The @link reference could not be resolved: The package "@contember/react-slate-editor-legacy" does not have an export "BlockRepeater"
// Warning: (ae-unresolved-link) The @link reference could not be resolved: The package "@contember/react-slate-editor-legacy" does not have an export "DiscriminatedBlocks"
//
// @public
export const Block: FunctionComponent<BlockProps>;

// @public (undocumented)
export const blockAnalyzer: ChildrenAnalyzer<BlockProps, never, Environment<Environment.AnyNode | undefined>>;

// @public
export const BlockEditor: FunctionComponent<BlockEditorProps> & {
    ContentOutlet: (props: ContentOutletProps) => ReactElement | null;
};

// @public (undocumented)
export interface BlockEditorProps extends SugaredRelativeEntityList, CreateEditorPublicOptions {
    // (undocumented)
    children?: ReactNode;
    // (undocumented)
    contentField: SugaredRelativeSingleField['field'];
    // (undocumented)
    embedContentDiscriminationField?: SugaredRelativeSingleField['field'];
    // (undocumented)
    embedHandlers?: Iterable<EmbedHandler>;
    // (undocumented)
    embedReferenceDiscriminateBy?: SugaredDiscriminateBy;
    // (undocumented)
    monolithicReferencesMode?: boolean;
    // (undocumented)
    referenceDiscriminationField?: SugaredRelativeSingleField['field'];
    // (undocumented)
    referencesField?: SugaredRelativeEntityList | string;
    // (undocumented)
    renderReference?: ComponentType<ReferenceElementRendererProps>;
    // Warning: (ae-forgotten-export) The symbol "OverrideRenderElementOptions" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    renderSortableBlock: OverrideRenderElementOptions['renderSortableBlock'];
    // (undocumented)
    sortableBy: SugaredRelativeSingleField['field'];
}

// @public (undocumented)
export interface BlockProps {
    // (undocumented)
    alternate?: ReactNode;
    // (undocumented)
    children?: ReactNode;
    // (undocumented)
    description?: ReactNode;
    discriminateBy: SugaredDiscriminateBy;
    // (undocumented)
    label?: ReactNode;
}

// @public (undocumented)
export interface ContentOutletProps {
    // (undocumented)
    placeholder?: string;
}

// @public (undocumented)
export type CreateElementReferences = (editor: Editor, targetPath: Slate.Path, referenceDiscriminant: FieldValue, initialize?: EntityAccessor.BatchUpdatesHandler) => EntityAccessor;

// @public (undocumented)
export const createReferenceElementPlugin: (args: ReferenceElementOptions) => EditorElementPlugin<ReferenceElement>;

// @public (undocumented)
export interface DiscriminatedDatum {
    // (undocumented)
    discriminateBy: SugaredDiscriminateBy;
}

// @public (undocumented)
export const EditorInlineReferencePortal: (props: EditorInlineReferenceTriggerProps) => JSX_2.Element | null;

// @public (undocumented)
export interface EditorInlineReferenceTriggerProps {
    // (undocumented)
    children: ReactNode;
    // (undocumented)
    initializeReference?: EntityAccessor_2.BatchUpdatesHandler;
    // (undocumented)
    referenceType: OptionallyVariableFieldValue_2;
}

// @public (undocumented)
export interface EditorReferenceBlock extends BlockProps {
    // (undocumented)
    template: EditorTemplate;
}

// @public (undocumented)
export type EditorReferenceBlocks = NormalizedDiscriminatedData<EditorReferenceBlock>;

// @internal (undocumented)
export const EditorReferenceBlocksContext: Context<EditorReferenceBlocks>;

// @public (undocumented)
export const EditorReferenceTrigger: ({ referenceType, ...props }: EditorReferenceTriggerProps) => JSX_2.Element;

// @public (undocumented)
export interface EditorReferenceTriggerProps {
    // (undocumented)
    children: ReactElement;
    // (undocumented)
    referenceType: OptionallyVariableFieldValue_2;
}

// @public (undocumented)
export type EditorTemplate = undefined | {
    blockContent: EditorTemplateAtom<ContentOutletProps> | undefined;
};

// @public (undocumented)
export type EditorWithBlocks = Editor & WithBlockElements;

// @public (undocumented)
export interface ElementWithReference extends Element_2 {
    // (undocumented)
    referenceId: EntityId;
}

// @public (undocumented)
export interface EmbedHandler<EmbedArtifacts = any> {
    // (undocumented)
    debugName: string;
    // (undocumented)
    discriminateBy: SugaredDiscriminateBy;
    // (undocumented)
    handleSource: (source: string, url: URL | undefined) => undefined | EmbedArtifacts | Promise<EmbedArtifacts | undefined>;
    // (undocumented)
    populateEmbedData: (options: PopulateEmbedDataOptions<EmbedArtifacts>) => void;
    // (undocumented)
    renderEmbed: () => ReactNode;
    // (undocumented)
    staticRender: (environment: Environment) => ReactNode;
}

// @public (undocumented)
export const EmbedHandlers: {
    GoogleForm: typeof GoogleFormEmbedHandler;
    YouTube: typeof YouTubeEmbedHandler;
    Vimeo: typeof VimeoEmbedHandler;
    SoundCloud: typeof SoundCloudEmbedHandler;
    Spotify: typeof SpotifyEmbedHandler;
};

// @public (undocumented)
export const getDiscriminatedBlock: (blocks: NormalizedBlocks, field: FieldAccessor | FieldValue) => ResolvedDiscriminatedDatum<BlockProps> | undefined;

// @public (undocumented)
export const getDiscriminatedDatum: <Datum>(data: NormalizedDiscriminatedData<Datum>, discriminant: FieldAccessor | FieldValue) => ResolvedDiscriminatedDatum<Datum> | undefined;

// @public (undocumented)
export const initBlockEditor: ({ editor, ...options }: InitEditorOptions & {
    editor: Editor;
}) => void;

// @public (undocumented)
export interface InitEditorOptions extends OverrideCreateElementReferenceOptions, ReferenceElementOptions, OverrideInsertDataOptions, OverrideRenderElementOptions, OverrideInsertElementWithReferenceOptions {
}

// @public (undocumented)
export interface InitializeReferenceContentProps {
    // (undocumented)
    editor: EditorWithBlocks;
    // (undocumented)
    onCancel: () => void;
    // (undocumented)
    onSuccess: (options?: {
        createElement?: Partial<Element_2>;
    }) => void;
    // (undocumented)
    referenceId: EntityId_2;
    // (undocumented)
    selection: Range_2 | null;
}

// @public (undocumented)
export type InsertElementWithReference = (element: Omit<Element_2, 'referenceId'>, referenceDiscriminant: FieldValue, initialize?: EntityAccessor.BatchUpdatesHandler) => void;

// @public (undocumented)
export const isElementWithReference: (candidate: Node_2) => candidate is ElementWithReference;

// @public (undocumented)
export const isReferenceElement: (node: Node_2) => node is ReferenceElement;

// @public (undocumented)
export type NormalizedBlocks = NormalizedDiscriminatedData<BlockProps>;

// @public (undocumented)
export type NormalizedDiscriminatedData<Datum> = Map<FieldValue, ResolvedDiscriminatedDatum<Datum>>;

// @public (undocumented)
export type NormalizedEmbedHandlers = NormalizedDiscriminatedData<EmbedHandler>;

// @public (undocumented)
export interface OverrideCreateElementReferenceOptions {
    // (undocumented)
    createElementReferences: CreateElementReferences;
}

// @public (undocumented)
export interface OverrideInsertDataOptions {
    // (undocumented)
    embedContentDiscriminationField: RelativeSingleField | undefined;
    // (undocumented)
    embedHandlers: NormalizedEmbedHandlers | undefined;
    // (undocumented)
    embedReferenceDiscriminateBy: FieldValue | undefined;
}

// @public (undocumented)
export interface OverrideInsertElementWithReferenceOptions {
    // (undocumented)
    insertElementWithReference: InsertElementWithReference;
}

// @public (undocumented)
export interface PopulateEmbedDataOptions<EmbedArtifacts = any> {
    // (undocumented)
    embedArtifacts: EmbedArtifacts;
    // (undocumented)
    entity: EntityAccessor;
    // (undocumented)
    source: string;
}

// @public (undocumented)
export const prepareElementForInsertion: (editor: Editor, node: Node_2) => Path;

// @public (undocumented)
export interface ReferenceElement extends ElementWithReference {
    // (undocumented)
    type: typeof referenceElementType;
}

// @public (undocumented)
export interface ReferenceElementOptions {
    // (undocumented)
    editorReferenceBlocks: EditorReferenceBlocks;
    // (undocumented)
    embedContentDiscriminationField: RelativeSingleField | undefined;
    // (undocumented)
    embedHandlers: NormalizedEmbedHandlers | undefined;
    // (undocumented)
    embedReferenceDiscriminateBy: FieldValue | undefined;
    // (undocumented)
    embedSubBlocks: NormalizedBlocks | undefined;
    // (undocumented)
    getReferencedEntity: (path: Path, referenceId: EntityId) => EntityAccessor;
    // (undocumented)
    referenceDiscriminationField: RelativeSingleField | undefined;
    // (undocumented)
    renderReference: ComponentType<ReferenceElementRendererProps> | undefined;
}

// @public (undocumented)
export interface ReferenceElementRendererProps extends RenderElementProps, ReferenceElementOptions {
    // (undocumented)
    element: ReferenceElement;
    // (undocumented)
    referenceDiscriminationField: RelativeSingleField;
}

// @public (undocumented)
export const referenceElementType: "reference";

// @public (undocumented)
export interface ResolvedDiscriminatedDatum<Datum> {
    // (undocumented)
    datum: Datum;
    // (undocumented)
    discriminateBy: FieldValue;
}

// @public (undocumented)
export const SortedBlocksContext: Context<EntityAccessor[]>;

// @public (undocumented)
export type SugaredDiscriminateBy = OptionallyVariableFieldValue;

// @public (undocumented)
export const useBlockEditorSlateNodes: ({ editor, blockElementCache, blockElementPathRefs, blockContentField, topLevelBlocks, }: UseBlockEditorSlateNodesOptions) => Descendant[];

// @public (undocumented)
export interface UseBlockEditorSlateNodesOptions {
    // (undocumented)
    blockContentField: SugaredFieldProps['field'];
    // (undocumented)
    blockElementCache: WeakMap<EntityAccessor, Element_2>;
    // (undocumented)
    blockElementPathRefs: Map<EntityId, PathRef>;
    // (undocumented)
    editor: Editor;
    // (undocumented)
    topLevelBlocks: EntityAccessor[];
}

// @public (undocumented)
export const useBlockProps: (children: ReactNode, env: Environment) => BlockProps[];

// @public (undocumented)
export const useDiscriminatedData: <Datum extends DiscriminatedDatum = DiscriminatedDatum>(source: Iterable<Datum>) => NormalizedDiscriminatedData<Datum>;

// @public (undocumented)
export const useEditorReferenceBlocks: () => EditorReferenceBlocks;

// @public (undocumented)
export const useNormalizedBlocks: (children: ReactNode, env: Environment) => NormalizedBlocks;

// @public (undocumented)
export interface WithBlockElements {
    // (undocumented)
    createElementReference: (targetPath: Slate.Path, referenceDiscriminant: FieldValue, initialize?: EntityAccessor.BatchUpdatesHandler) => EntityAccessor;
    // (undocumented)
    getReferencedEntity: (referenceId: string) => EntityAccessor;
    // (undocumented)
    insertElementWithReference: <Element extends Slate.Element>(element: Omit<Element, 'referenceId'>, referenceDiscriminant: FieldValue, initialize?: EntityAccessor.BatchUpdatesHandler) => void;
    // (undocumented)
    slate: typeof Slate;
}


export * from "@contember/react-slate-editor-base";

// Warnings were encountered during analysis:
//
// src/blockEditor/embed/index.ts:5:27 - (ae-forgotten-export) The symbol "GoogleFormEmbedHandler" needs to be exported by the entry point index.d.ts
// src/blockEditor/embed/index.ts:5:27 - (ae-forgotten-export) The symbol "YouTubeEmbedHandler" needs to be exported by the entry point index.d.ts
// src/blockEditor/embed/index.ts:5:27 - (ae-forgotten-export) The symbol "VimeoEmbedHandler" needs to be exported by the entry point index.d.ts
// src/blockEditor/embed/index.ts:5:27 - (ae-forgotten-export) The symbol "SoundCloudEmbedHandler" needs to be exported by the entry point index.d.ts
// src/blockEditor/embed/index.ts:5:27 - (ae-forgotten-export) The symbol "SpotifyEmbedHandler" needs to be exported by the entry point index.d.ts
// src/blockEditor/templating/getEditorTemplate.tsx:16:3 - (ae-forgotten-export) The symbol "EditorTemplateAtom" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```
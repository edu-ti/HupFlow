'use client';

import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TopTitle } from '@gitroom/frontend/components/launches/helpers/top.title.component';
import 'polotno/polotno.blueprint.css';
import { createStore } from 'polotno/model/store';
import Workspace from 'polotno/canvas/workspace';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';
import Toolbar from 'polotno/toolbar/toolbar';
import ZoomButtons from 'polotno/toolbar/zoom-buttons';
import { Button } from '@gitroom/react/form/button';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { PictureGeneratorSection } from '@gitroom/frontend/components/launches/polonto/polonto.picture.generation';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { loadVars } from '@gitroom/react/helpers/variable.context';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useLaunchStore } from '@gitroom/frontend/components/new-launch/store';
const store = createStore({
  get key() {
    return loadVars().plontoKey;
  },
  showCredit: false,
});

export type SocialPreset = {
  id: string;
  name: string;
  label: string;
  width: number;
  height: number;
  ratio: string;
  network: string;
};

export const SOCIAL_PRESETS: SocialPreset[] = [
  {
    id: 'square',
    name: '1:1',
    label: '1:1 Quadrado',
    width: 1080,
    height: 1080,
    ratio: '1:1',
    network: 'Instagram / FB',
  },
  {
    id: 'landscape',
    name: '16:9',
    label: '16:9 Paisagem',
    width: 1200,
    height: 675,
    ratio: '16:9',
    network: 'X / LinkedIn',
  },
  {
    id: 'vertical',
    name: '9:16',
    label: '9:16 Stories',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    network: 'Reels / TikTok',
  },
  {
    id: 'portrait',
    name: '4:5',
    label: '4:5 Retrato',
    width: 1080,
    height: 1350,
    ratio: '4:5',
    network: 'Instagram Feed',
  },
];

// @ts-ignore
const CloseContext = createContext({
  close: {} as any,
  setMedia: {} as any,
});
const ActionControls = ({ store }: any) => {
  const t = useT();
  const close = useContext(CloseContext);
  const [load, setLoad] = useState(false);
  const fetch = useFetch();
  return (
    <div>
      <Button
        loading={load}
        className="outline-none"
        innerClassName="invert outline-none text-black"
        onClick={async () => {
          setLoad(true);
          const blob = await store.toBlob();
          const formData = new FormData();
          formData.append('file', blob, 'media.png');
          const data = await (
            await fetch('/media/upload-simple', {
              method: 'POST',
              body: formData,
            })
          ).json();
          close.setMedia([
            {
              id: data.id,
              path: data.path,
            },
          ]);
          close.close();
        }}
      >
        {t('use_this_media', 'Use this media')}
      </Button>
    </div>
  );
};
const Polonto: FC<{
  setMedia: (params: { id: string; path: string }[]) => void;
  initialMedia?: { id: string; path: string };
  type?: 'image' | 'video';
  closeModal: () => void;
  width?: number;
  height?: number;
}> = (props) => {
  const { setMedia, initialMedia, type, closeModal } = props;

  const [activePreset, setActivePreset] = useState<string>('square');
  const [currentDimensions, setCurrentDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: props.width || 1080,
    height: props.height || 1080,
  });

  const setActivateExitButton = useLaunchStore((e) => e.setActivateExitButton);
  useEffect(() => {
    setActivateExitButton(false);
    return () => {
      setActivateExitButton(true);
    };
  }, []);

  const user = useUser();
  const features = useMemo(() => {
    return [
      ...DEFAULT_SECTIONS,
      ...(user?.tier?.image_generator ? [PictureGeneratorSection] : []),
    ] as any[];
  }, [user?.tier?.image_generator]);

  const handleSelectPreset = (preset: SocialPreset) => {
    setActivePreset(preset.id);
    setCurrentDimensions({ width: preset.width, height: preset.height });
    store.setSize(preset.width, preset.height);
  };

  useEffect(() => {
    store.clear();
    const w = props.width || 1080;
    const h = props.height || 1080;
    const page = store.addPage({
      width: w,
      height: h,
    });

    if (initialMedia?.path) {
      page.addElement({
        type: 'image',
        src: initialMedia.path,
        x: 0,
        y: 0,
        width: w,
        height: h,
      });
    }

    return () => {
      store.clear();
    };
  }, []);

  return (
    <div className="bg-white text-black relative z-[400] polonto flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Formato:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SOCIAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  activePreset === preset.id
                    ? 'bg-black text-white shadow-sm font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                title={`${preset.width}x${preset.height} px`}
              >
                <span>{preset.label}</span>
                <span
                  className={`text-[10px] ${
                    activePreset === preset.id
                      ? 'text-gray-300'
                      : 'text-gray-400'
                  }`}
                >
                  ({preset.network})
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span>
            Dimensão:{' '}
            <strong className="font-mono text-gray-800">
              {currentDimensions.width}x{currentDimensions.height}px
            </strong>
          </span>
        </div>
      </div>

      <CloseContext.Provider
        value={{
          close: () => closeModal(),
          setMedia,
        }}
      >
        <PolotnoContainer
          style={{
            width: '100%',
            height: '700px',
          }}
        >
          <SidePanelWrap>
            <SidePanel store={store} sections={features} />
          </SidePanelWrap>
          <WorkspaceWrap>
            <Toolbar
              store={store}
              components={{
                ActionControls,
              }}
            />
            <Workspace store={store} />
            <ZoomButtons store={store} />
          </WorkspaceWrap>
        </PolotnoContainer>
      </CloseContext.Provider>
    </div>
  );
};
export default Polonto;

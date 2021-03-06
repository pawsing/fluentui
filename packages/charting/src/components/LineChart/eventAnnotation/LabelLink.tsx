import * as React from 'react';
import { Callout, FocusZone, FocusZoneDirection, List } from 'office-ui-fabric-react';
import { Textbox } from '@uifabric/charting/lib/components/LineChart/eventAnnotation/Textbox';
import { IEventAnnotation } from '../../../types/IEventAnnotation';

export interface ILineDef extends IEventAnnotation {
  x: number;
}

export interface ILabelDef {
  x: number;
  aggregatedIdx: number[];
  anchor: 'start' | 'end';
}

interface ILabelLinkProps {
  lineDefs: ILineDef[];
  labelDef: ILabelDef;
  textY: number;
  textWidth: number;
  textLineHeight: number;
  textFontSize: string;
  textColor: string;
  mergedLabel: (count: number) => string;
}

/* tslint:disable-next-line:function-name */
export function LabelLink(props: ILabelLinkProps) {
  const gRef = React.useRef<SVGGElement>(null);
  const [showCard, setShowCard] = React.useState(false);
  const onDismiss = () => setShowCard(false);
  const onClick = () => setShowCard(true);
  const onRenderCell = (i: (() => React.ReactNode) | undefined) => <div data-is-focusable={true}>{i && i()}</div>;

  let callout: React.ReactNode = null;
  if (showCard) {
    const cards = props.labelDef.aggregatedIdx.map(i => props.lineDefs[i].onRenderCard!).filter(c => !!c);
    if (cards.length > 0) {
      callout = (
        <Callout target={gRef.current} onDismiss={onDismiss} setInitialFocus={true} role="dialog">
          <FocusZone isCircularNavigation={true} direction={FocusZoneDirection.vertical}>
            <List<() => React.ReactNode> items={cards} onRenderCell={onRenderCell} />
          </FocusZone>
        </Callout>
      );
    }
  }

  let text: string;
  let fill: string | undefined;
  if (props.labelDef.aggregatedIdx.length === 1) {
    text = props.lineDefs[props.labelDef.aggregatedIdx[0]].event;
    fill = props.textColor;
  } else {
    text = props.mergedLabel(props.labelDef.aggregatedIdx.length);
    fill = props.textColor;
  }

  return (
    <>
      {/* tslint:disable-next-line: jsx-ban-props */}
      <g ref={gRef} onClick={onClick} data-is-focusable={true} style={{ cursor: 'pointer' }}>
        <Textbox
          text={text}
          x={props.labelDef.x}
          y={props.textY}
          width={props.textWidth}
          lineHeight={props.textLineHeight}
          textAnchor={props.labelDef.anchor}
          fontSize={props.textFontSize}
          fill={fill}
        />
      </g>
      {callout}
    </>
  );
}

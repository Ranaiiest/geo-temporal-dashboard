// src/components/timeline/TimelineSlider.tsx
import { Slider, Col, Row, Tooltip, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { setTimeRange } from '../../store/slices/timelineSlice';
import { differenceInHours, format, fromUnixTime, getUnixTime, parseISO } from 'date-fns';
import { useEffect } from 'react';
import { fetchPolygonData } from '../../store/slices/polygonsSlice';

const { Text } = Typography;

export function TimelineSlider() {
  const dispatch = useAppDispatch();
  const { windowStart, windowEnd, selectedStart, selectedEnd } = useAppSelector(
    (state) => state.timeline
  );
  const polygons = useAppSelector((state) => state.polygons.polygons);

  const windowStartDate = parseISO(windowStart);
  const windowEndDate = parseISO(windowEnd);

  const totalHours = differenceInHours(windowEndDate, windowStartDate);

  const sliderValueStart = differenceInHours(parseISO(selectedStart), windowStartDate);
  const sliderValueEnd = differenceInHours(parseISO(selectedEnd), windowStartDate);

  const intervalDuration = differenceInHours(parseISO(selectedEnd), parseISO(selectedStart)) + 1;

  const handleSliderChange = (value: number[]) => {
    const [startHour, endHour] = value;
    
    const newSelectedStart = fromUnixTime(getUnixTime(windowStartDate) + startHour * 3600);
    const newSelectedEnd = fromUnixTime(getUnixTime(windowStartDate) + endHour * 3600);

    dispatch(setTimeRange({ 
      start: newSelectedStart.toISOString(), 
      end: newSelectedEnd.toISOString()
    }));
  };

  useEffect(() => {
    for (const poly of polygons) {
        dispatch(fetchPolygonData(poly.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStart, selectedEnd, dispatch]);


  const tooltipFormatter = (value?: number) => {
    if (typeof value === 'number') {
      const date = fromUnixTime(getUnixTime(windowStartDate) + value * 3600);
      return format(date, 'MMM d, HH:00');
    }
    return '';
  };

  return (
    <div style={{ padding: '8px 16px', color: 'white' }}>
      <Row align="middle" gutter={8}>
        <Col span={5} style={{ textAlign: 'center' }}>
          {/* THE FIX IS HERE: Reduced font sizes for mobile readability */}
          <Text type="secondary" style={{ fontSize: '11px' }}>Start</Text>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{format(parseISO(selectedStart), 'MMM d')}</div>
          <div style={{ fontSize: '11px' }}>{format(parseISO(selectedStart), 'HH:00')}</div>
        </Col>
        <Col span={14}>
          <Row justify="center" style={{ marginBottom: '-12px' }}>
            <Col>
              <Text strong style={{ color: '#1677ff', fontSize: '12px' }}>
                {intervalDuration} Hour{intervalDuration > 1 ? 's' : ''} Selected
              </Text>
            </Col>
          </Row>
          <Slider
            className="custom-visible-slider"
            range
            min={0}
            max={totalHours}
            onChange={handleSliderChange}
            value={[sliderValueStart, sliderValueEnd]}
            tooltip={{ formatter: tooltipFormatter }}
            step={1}
          />
          <Row justify="space-between" style={{ marginTop: '-12px', padding: '0 4px' }}>
            <Col>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                {format(windowStartDate, 'MMM d')}
              </Text>
            </Col>
            <Col>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                {format(windowEndDate, 'MMM d')}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col span={5} style={{ textAlign: 'center' }}>
          {/* THE FIX IS HERE: Reduced font sizes for mobile readability */}
          <Text type="secondary" style={{ fontSize: '11px' }}>End</Text>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{format(parseISO(selectedEnd), 'MMM d')}</div>
          <div style={{ fontSize: '11px' }}>{format(parseISO(selectedEnd), 'HH:00')}</div>
        </Col>
      </Row>
    </div>
  );
}
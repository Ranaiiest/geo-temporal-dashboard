
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

  // Calculate the duration of the selected interval.
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
    
  }, [selectedStart, selectedEnd, dispatch]);


  const tooltipFormatter = (value?: number) => {
    if (typeof value === 'number') {
      const date = fromUnixTime(getUnixTime(windowStartDate) + value * 3600);
      return format(date, 'MMM d, HH:00');
    }
    return '';
  };

  return (
    
    <div style={{ padding: '8px 24px', color: 'white' }}>
      <Row align="middle" gutter={16}>
        <Col span={4} style={{ textAlign: 'center' }}>
          
          <Text type="secondary" style={{ fontSize: '12px' }}>Start</Text>
          <div>{format(parseISO(selectedStart), 'MMM d')}</div>
          <div style={{ fontSize: '12px' }}>{format(parseISO(selectedStart), 'HH:00')}</div>
        </Col>
        <Col span={16}>
          
          <Row justify="space-between" style={{ marginBottom: '-8px' }}>
            <Col>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {format(windowStartDate, 'MMM d, yyyy')}
              </Text>
            </Col>
            <Col>
              <Text strong style={{ color: '#1677ff' }}>
                {intervalDuration} Hour{intervalDuration > 1 ? 's' : ''} Selected
              </Text>
            </Col>
            <Col>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {format(windowEndDate, 'MMM d, yyyy')}
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
        </Col>
        <Col span={4} style={{ textAlign: 'center' }}>
          
          <Text type="secondary" style={{ fontSize: '12px' }}>End</Text>
          <div>{format(parseISO(selectedEnd), 'MMM d')}</div>
          <div style={{ fontSize: '12px' }}>{format(parseISO(selectedEnd), 'HH:00')}</div>
        </Col>
      </Row>
    </div>
  );
}
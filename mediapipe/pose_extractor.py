import cv2
import mediapipe as mp
from pose_landmarks import PoseLandmarks

class PoseExtractor:
    def __init__(self):
        self.pose = mp.solutions.pose.Pose(
            static_image_mode=False,
            model_complexity=0,
            smooth_landmarks=True,
            enable_segmentation=False,
            smooth_segmentation=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils
        self.pose_connections = mp.solutions.pose.POSE_CONNECTIONS
        self.results = None
        self.previous_landmarks = {}

    def get_pose(self, img, draw):
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(img_rgb)

        if draw and self.results.pose_landmarks:
            self.mp_draw.draw_landmarks(img, self.results.pose_landmarks, self.pose_connections)

        return img

    def get_position(self, img, movement_threshold, draw):
        lm_list = []
        if self.results and self.results.pose_landmarks:
            h, w, _ = img.shape

            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                cx, cy = int(lm.x * w), int(lm.y * h)
                name = PoseLandmarks(id).name

                prev = self.previous_landmarks.get(name, (cx, cy))
                dx, dy = abs(cx - prev[0]), abs(cy - prev[1])
                self.previous_landmarks[name] = (cx, cy)

                if dx > movement_threshold or dy > movement_threshold:
                    lm_list.append([name, cx, cy])

                    if draw:
                        cv2.circle(img, (cx, cy), 7, (255, 0, 0), cv2.FILLED)

        return lm_list
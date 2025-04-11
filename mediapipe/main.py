import cv2
from pose_extractor import PoseExtractor
import time

def main():
    cap = cv2.VideoCapture(1)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    detector = PoseExtractor()
    
    movement_threshold = 4 # If a landmark moves more than this threshold, it will be stored in lm_list
    debug = True

    p_time = 0

    while cap.isOpened():
        success, image = cap.read()
        image = cv2.flip(image, 1) # Flip image for mirrored effect

        if not success:
            print("Ignoring empty camera frame.")
            continue

        image = detector.get_pose(image, draw=debug)
        lm_list = detector.get_position(image, movement_threshold=movement_threshold, draw=debug)

        if lm_list and debug:
            print(lm_list)

        c_time = time.time()
        fps = 1 / (c_time - p_time)
        p_time = c_time

        cv2.putText(image, f'FPS: {int(fps)}', (10, 20), cv2.FONT_ITALIC, 0.5, (0, 255, 0), 2)

        cv2.imshow("Camera Feedback", image)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
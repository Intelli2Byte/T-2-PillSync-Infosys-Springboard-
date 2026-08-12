from src.evaluator import evaluate_dataset, print_report
if __name__ == "__main__":
    report = evaluate_dataset(max_samples=100, delay=0.5)
    print_report(report)
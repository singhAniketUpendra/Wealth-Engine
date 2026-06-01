using AutoMapper;
using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Application.Repository.Interfaces;
using Investment.Application.Service.Interface;
using Investment.Domain.Entities;

namespace Investment.Application.Service.Implementation
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepo;
        private readonly IAssetRepository _assetRepo; // Zaruri hai validation ke liye
        private readonly IMapper _mapper;

        public TransactionService(
            ITransactionRepository transactionRepo,
            IAssetRepository assetRepo,
            IMapper mapper)
        {
            _transactionRepo = transactionRepo;
            _assetRepo = assetRepo;
            _mapper = mapper;
        }

        public async Task<TransactionResponseDto> ExecuteTransactionAsync(TransactionRequestDto request)
        {
            // 1. Validate if Asset exists
            var asset = await _assetRepo.GetByIdAsync(request.AssetId);
            if (asset == null) throw new Exception("Asset not found");

            // 2. Map DTO to Entity
            var transaction = _mapper.Map<Transaction>(request);
            transaction.TransactionDate = DateTime.UtcNow;

            // 3. Save to Database
            await _transactionRepo.AddAsync(transaction);

            // 4. Return mapped response
            var response = _mapper.Map<TransactionResponseDto>(transaction);
            response.AssetName = asset.AssetName; // Manual set for UI friendliness

            return response;
        }

        public async Task<IEnumerable<TransactionResponseDto>> GetUserHistoryAsync(int userId)
        {
            var transactions = await _transactionRepo.GetByUserIdAsync(userId);

            var responseList = _mapper.Map<IEnumerable<TransactionResponseDto>>(transactions).ToList();

            // UI Friendliness ke liye AssetName safely set kar dete hain
            var transactionArray = transactions.ToList();
            for (int i = 0; i < responseList.Count; i++)
            {
                responseList[i].AssetName = transactionArray[i].Asset?.AssetName ?? "Unknown Asset";
            }

            return responseList;
        }

        public async Task<IEnumerable<TransactionResponseDto>> GetPortfolioHistoryAsync(int portfolioId)
        {
            var transactions = await _transactionRepo.GetByPortfolioIdAsync(portfolioId);
            return _mapper.Map<IEnumerable<TransactionResponseDto>>(transactions);
        }

        public async Task<IEnumerable<TransactionResponseDto>> GetAllTransactionsForAdminAsync()
        {
            var transactions = await _transactionRepo.GetAllTransactionsWithUsersAsync();
            var responseList = _mapper.Map<IEnumerable<TransactionResponseDto>>(transactions).ToList();

            var transactionArray = transactions.ToList();
            for (int i = 0; i < responseList.Count; i++)
            {
                var rawTx = transactionArray[i];
                responseList[i].AssetName = rawTx.Asset?.AssetName ?? "Unknown Asset";

                // 🔥 EXTRACT IDENTITIES FROM DEEP POOL NEST
                responseList[i].Username = rawTx.Portfolio?.User?.Username ?? "System Client";
                responseList[i].Email = rawTx.Portfolio?.User?.Email ?? "N/A";
            }

            return responseList;
        }

        public async Task<TransactionResponseDto?> GetTransactionByIdAsync(int id)
        {
            // We assume your ITransactionRepository has a GetByIdAsync method
            // In many cases, it's better to fetch it with the Asset included for the UI
            var transaction = await _transactionRepo.GetByIdAsync(id);
            return _mapper.Map<TransactionResponseDto>(transaction);
        }

        public async Task<bool> DeleteTransactionAsync(int id)
        {
            var transaction = await _transactionRepo.GetByIdAsync(id);
            if (transaction == null) return false;

            await _transactionRepo.DeleteAsync(id);
            return true;
        }
    }
}
